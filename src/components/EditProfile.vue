<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" transition="modal" @click="close" v-show="show">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">

        <a @click="cancel()" class="close">&times;</a>

        <div class="modal-header">
          <h3>Edit Profile</h3>
        </div>

        <form @submit.prevent="saveProfileSettings" autocomplete="off">
          <!-- Profile Picture Upload Input -->
          <label style="color: #5a5a5a; margin-top: 10px; font-size: 14px">Profile Picture</label>
          <div class="md-form flex-center file-upload">
            <input
              type="file"
              class="input-file btn btn-blue-grey"
              @change="update"
              accept="image/jpeg,image/jpg,image/png"
            >
          </div>
          <p v-if="!validImageSize">Please upload an image under 5MB.</p>
          <svg class="circular-loader" v-if="isLoading">
            <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#67737f" stroke-width="2" />
          </svg>
          <!-- Where the image thumbnail appears on upload -->
          <div id="preview">
            <img class="thumbnail" v-if="this.cloneUserProfile.picid" :src=this.cloneUserProfile.url>
          </div>
          <div class="alert alert-danger" v-if="error">
              <p>{{ error }}</p>
          </div>
          <!-- First Name Input Field -->
          <label class="edit-label">First Name</label>
          <div class="md-form">
            <input
              type="text"
              class="form-control"
              v-model="cloneUserProfile.firstname"
              maxlength="30">
          </div>
          <!-- Last Name Input Field -->
          <label class="edit-label">Last Name</label>
          <div class="md-form">
            <input
              type="text"
              class="form-control"
              v-model="cloneUserProfile.lastname"
              maxlength="30"
            >
          </div>
          <!-- Email Input Field -->
          <label class="edit-label">Email</label>
          <div class="md-form">
            <input type="email"
                   class="form-control"
                   v-model="cloneUserProfile.email"
                   required
                   maxlength="40"
            >
          </div>
          <div class="alert alert-danger" v-if="emailErr">
                <p>{{ emailErr }}</p>
          </div>
          <!-- Phone Number Input Field -->
          <label class="edit-label">Phone</label>
          <div class="md-form">
            <input
              id="phoneNumber"
              type="tel"
              class="form-control"
              v-model="cloneUserProfile.phone"
              @keypress="numberPressed"
              minlength="16"
              maxlength="16"
            >
          </div>
          <div class="alert alert-danger" v-if="phoneErr">
                <p>{{ phoneErr }}</p>
          </div>
          <!-- Zip Code Input Field -->
          <label class="edit-label">Zip</label>
          <div class="md-form">
            <input
              type="text"
              class="form-control"
              v-model="cloneUserProfile.zipcode"
              @keypress="numberPressed"
              minlength="5"
              maxlength="5"
            >
          </div>
          <div class="alert alert-danger" v-if="zipErr">
                <p>{{ zipErr }}</p>
          </div>
        </form>

        <div class="modal-footer text-right">
          <input type="button" class="btn btn-danger cancel" value="Cancel" @click="cancel()">
          <input type="submit" class="btn btn-mdb" value="Save Changes" @click="saveProfileSettings()">
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
var _ = require('lodash')
import axios from 'axios'
export default {
  data () {
    return {
      cloneUserProfile: {},
      updateUser: {
        id: '',
        picid: '',
        url: '',
        postUrl: '',
        firstname: '',
        lastname: '',
        items: [],
        email: '',
        phone: '',
        zipcode: ''
      },
      profileImage: {},
      error: '',
      phoneErr: '',
      zipErr: '',
      emailErr: '',
      isError: false,
      previouslyUsedPicId: '',
      imageChanged: false,
      validImageSize: true,
      // A check for whether the modal should be shown
      show: true,
      isLoading: false
    }
  },
  computed: {
    UserProfile () {
      return this.$store.state.viewedUserProfile
    },
    getCurrentUser () {
      return this.$store.state.currentUser
    },
    getToken () {
      return this.$store.state.token
    }
  },
  mounted () {
    if (this.getToken === null) {
      this.$router.push('/login')
    } else if (this.UserProfile.id !== this.getCurrentUser) {
      this.$router.push('/')
    } else {
      // Allows modal close when pressing the ESC key
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
      })
      this.cloneUserProfile = _.cloneDeep(this.UserProfile)
      // Begin phone number input validation ------------------
      document.getElementById('phoneNumber').addEventListener('keyup', function (evt) {
        var phoneNumber = document.getElementById('phoneNumber')
        phoneNumber.value = phoneFormat(phoneNumber.value)
      })
      // We need to manually format the phone number on page load
      document.getElementById('phoneNumber').value = phoneFormat(document.getElementById('phoneNumber').value)
    }

    // A function to format text to look like a phone number
    function phoneFormat (input) {
      // Strip all characters from the input except digits
      input = input.replace(/\D/g, '')
      // Based upon the length of the string, we add formatting as necessary
      var size = input.length
      if (size === 0) {
        // input = input
      } else if (size < 4) {
        input = '(' + input
      } else if (size < 7) {
        input = '(' + input.substring(0, 3) + ') ' + input.substring(3, 6)
      } else {
        input = '(' + input.substring(0, 3) + ') ' + input.substring(3, 6) + ' - ' + input.substring(6, 10)
      }
      return input
    }
  },
  methods: {
    // Closes the modal if its background is clicked
    close () {
      this.$router.push('/viewProfile/' + this.getCurrentUser)
      this.show = false
    },
    // Verfies that the email entered is entered in a valid format
    validateEmail (email) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
      } else {
        this.isError = true
        return false
      }
    },
    // Verifies that the phone number is entered in a valid format
    validatePhone (phone) {
      if (phone) {
        if (/\+?\d? ?\(?\d{3}\)? ?\d{3} ?-? ?\d{4}/.test(phone)) {
          return true
        } else {
          this.isError = true
          return false
        }
      } else { return true }
    },
    // Verifes that the zipcode is either entered as 5 digits or not at all
    validateZip (zipcode) {
      if (zipcode) {
        if (zipcode.length === 0 || zipcode.length === 5) {
          return true
        } else {
          this.isError = true
          return false
        }
      } else { return true }
    },
    update (event) {
      let vm = this
      vm.isLoading = true
      // Reset size check when user tries again
      vm.validImageSize = true
      let file = event.target.files[0]
      // For now, only allow images less than 5MB in size
      if (file.size > 5000000) {
        vm.isLoading = false
        vm.validImageSize = false
        return
      }
      let picDisplayer = new FileReader()
      picDisplayer.onload = (function (file) {
        return function (event) {
          vm.imageChanged = true
          let picFile = event.target
          let preview = document.getElementById('preview')
          // Erase previous image's thumbnail
          preview.innerHTML = '<img class=\'thumbnail\' src=\'' + picFile.result + '\'' +
            'title=\'' + file.name + '\' width=\'150px\' height=\'150px\' style=\'display: inline\'/>'
        }
      })(file)
      vm.profileImage = file
      // upload data to the server
      let picHasher = new FileReader()
      picHasher.onload = (function (file) {
        return function () {
          axios({
            method: 'post',
            url: '/api/image/new',
            data: {
              extension: file.type.split('/')[1]
            },
            headers: {
              'Authorization': 'Bearer ' + vm.getToken
            }
          })
            .then(res => {
              vm.isLoading = false
              // Save image Url and ID for later image saving and profile saving
              vm.previouslyUsedPicId = vm.cloneUserProfile.picid
              vm.cloneUserProfile.postUrl = res.data.url
              vm.cloneUserProfile.picid = res.data.picid
            })
            .catch(err => {
              vm.isLoading = false
              console.log(err)
            })
        }
      })(file)
      // Read the image
      picDisplayer.readAsDataURL(file)
      picHasher.readAsBinaryString(file)
    },
    // Saves the uploaded profile picture and
    // deletes the previously used profile picture
    // from the blob storage
    saveImage: function () {
      if (this.imageChanged === true && this.isError === false) {
        // If a new user uploads their first profile picture
        // they will not have a defined picid for a previous picture.
        // This if prevents an error throwing for
        // deleting an undefined picid
        if (this.previouslyUsedPicId === null) {
          return axios({
            method: 'put',
            url: this.updateUser.postUrl,
            data: this.profileImage
          })
        } else {
          axios({
            method: 'delete',
            url: '/api/images/delete/' + this.previouslyUsedPicId,
            data: this.previouslyUsedPicId,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })
          axios({
            method: 'put',
            url: this.updateUser.postUrl,
            data: this.profileImage
          })
            .then(res => {
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    getProfile: function () {
      return axios({
        method: 'get',
        url: '/api/users/' + this.getCurrentUser,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })
    },
    updateProfile: function () {
      return axios({
        method: 'put',
        url: '/api/users/edit/' + this.getCurrentUser,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.updateUser
      })
      .then(res => {
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.isError = true
          if (this.validateEmail(this.userProfile.email) &&
            this.validatePhone(this.userProfile.phone) &&
            this.validateZip(this.userProfile.zipcode)) {
            this.error = 'This email is already registered'
            this.isError = true
          } else {
            this.isError = true
          }
        }
      })
    },
    // Clones the changes entered and saves them when "Save Profile" is clicked
    saveProfileSettings () {
      this.isError = false
      this.zipErr = ''
      this.phoneErr = ''
      this.emailErr = ''
      this.userProfile = this.cloneUserProfile
      // Makes sure to set up data object with all data needed for vuex call
      // *Honestly this is ridiculous and needs improvement, but it works for now*
      this.updateUser.postUrl = this.cloneUserProfile.postUrl
      this.updateUser.id = this.getCurrentUser
      this.updateUser.firstname = this.cloneUserProfile.firstname
      this.updateUser.lastname = this.cloneUserProfile.lastname
      this.updateUser.picid = this.cloneUserProfile.picid
      this.updateUser.email = this.cloneUserProfile.email
      this.updateUser.phone = this.cloneUserProfile.phone
      this.updateUser.items = this.cloneUserProfile.items
      this.updateUser.zipcode = this.cloneUserProfile.zipcode
      let promises = []
      this.updateUser.url = null
      if (!this.validateEmail(this.userProfile.email)) {
        this.emailErr = 'The email you entered cannnot be used'
      }
      if (!this.validatePhone(this.userProfile.phone)) {
        this.phoneErr = 'The phone number you entered is invalid'
      }
      if (!this.validateZip(this.userProfile.zipcode)) {
        this.zipErr = 'The zipcode you entered is invalid'
      }
      promises.push(this.updateProfile())
      // if (this.imageChanged && this.isError === false) {
      //   promises.push(this.saveImage())
      // }
      // Make API call to update the user info and refresh data on front-end
      Promise.all(promises).then(res => {
        if (this.isError === false) {
          // If race condition occurs, getProfile may be trying to render the image before it exists,
          // saveImage may not be fast enough in some cases
          this.saveImage()
          this.getProfile()
            .then(res => {
              this.$store.commit('getViewedProfile', res.data)
              this.$router.push('/viewProfile/' + this.getCurrentUser)
            })
            .catch(error => {
              // Token expiry
              if (error.response.status === 401) {
                this.$store.commit('authenticate', null)
                let vm = this
                setTimeout(function () {
                  vm.$router.push('/login')
                }, 100)
              }
            })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    numberPressed (evt) {
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode < 48 || charCode > 57)) {
        evt.preventDefault()
        return false
      }
      return true
    },
    cancel () {
      this.$router.push('/viewProfile/' + this.getCurrentUser)
    }
  }
}
</script>

<style scoped>
span:hover {
  text-decoration: none;
  color: white;
}

.close {
  display: inline;
  float: right;
}

.file-upload {
  margin-bottom: 0;
}

.thumbnail {
  width: 150px;
  height: 150px;
  display: inline;
}

.edit-label {
  float: left;
  color: #5a5a5a;
}

h3 {
  display: inline;
}

.cancel {
  float: left;
}

.circular-loader {
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  height: 100px;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
  width: 100px;
}

.loader-path {
  stroke-dasharray: 150,200;
  stroke-dashoffset: -10;
  -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
}
@-webkit-keyframes color {
  0% {
    stroke: #67737f;
  }
  40% {
    stroke: #67737f;
  }
  66% {
    stroke: #67737f;
  }
  80%, 90% {
    stroke: #67737f;
  }
}
@keyframes color {
  0% {
    stroke: #67737f;
  }
  40% {
    stroke: #67737f;
  }
  66% {
    stroke: #67737f;
  }
  80%, 90% {
    stroke: #67737f;
  }
}
</style>
