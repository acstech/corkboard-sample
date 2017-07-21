<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" transition="modal" @click="close" v-show="show">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <a @click="cancel()" class="close">&times;</a>
      </div>
      <form @submit.prevent="saveProfileSettings" autocomplete="off">
          <label style="color: #5a5a5a; margin-top: 10px; font-size: 14px">Profile Picture</label>
          <div class="md-form flex-center">
            <input type="file" class="input-file btn btn-blue-grey" @change="update" accept="image/jpeg,image/jpg,image/png">
          </div>
          <p v-if="!validImageSize">Please upload an image under 5MB.</p>
          <div id="preview">
            <img class="thumbnail" v-if="this.cloneUserProfile.picid" :src=this.cloneUserProfile.url>
          </div>
        <label class="edit-label">First Name</label>
        <div class="md-form">
          <input type="text" class="form-control" v-model="cloneUserProfile.firstname" maxlength="30">
        </div>
        <label class="edit-label">First Name</label>
        <div class="md-form">
          <input type="text" class="form-control" v-model="cloneUserProfile.lastname" maxlength="30">
        </div>
        <label class="edit-label">Email</label>
        <div class="md-form">
          <input type="email" class="form-control" v-model="cloneUserProfile.email" required maxlength="40">
        </div>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <label class="edit-label">Phone</label>
        <div class="md-form">
          <input id="phoneNumber" type="tel" class="form-control" v-model="cloneUserProfile.phone"
                 @keypress="numberPressed" minlength="16" maxlength="16">
        </div>
        <label class="edit-label">Zip</label>
        <div class="md-form">
          <input type="text" class="form-control" v-model="cloneUserProfile.zipcode" @keypress="numberPressed"
                 minlength="5" maxlength="5">
        </div>
        <div class="alert alert-danger" v-if="phoneInputError">
          <p>{{ phoneInputError }}</p>
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
      phoneInputError: '',
      error: '',
      isError: false,
      previouslyUsedPicId: '',
      imageChanged: false,
      validImageSize: true,
      show: true
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
    close () {
      this.$router.push('/viewProfile/' + this.getCurrentUser)
      this.show = false
    },
    validateEmail (email) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
      } else {
        alert('You have entered an invalid email address!')
        this.userProfile.email = this.UserProfile.email
        return false
      }
    },
    update (event) {
      let vm = this
      // Reset size check when user tries again
      vm.validImageSize = true
      let file = event.target.files[0]
      // For now, only allow images less than 5MB in size
      if (file.size > 5000000) {
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
          preview.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" +
            "title='" + file.name + "' width='150px' height='150px' style='display: inline'/>"
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
              // Save image Url and ID for later image saving and profile saving
              vm.previouslyUsedPicId = vm.cloneUserProfile.picid
              vm.cloneUserProfile.postUrl = res.data.url
              vm.cloneUserProfile.picid = res.data.picid
            })
            .catch(err => {
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
      if (this.imageChanged === true) {
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
          this.error = 'The email you entered cannot be used.'
          this.isError = true
        }
      })
    },
    saveProfileSettings () {
      this.isError = false
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
      if (this.imageChanged) {
        promises.push(this.saveImage())
      }
      this.updateUser.url = null
      if (this.validateEmail(this.userProfile.email)) {
        // Make API call to update the user info and refresh data on front-end
        promises.push(this.updateProfile())
      }
      Promise.all(promises).then(res => {
        if (this.isError === false) {
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
</style>
