<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <a @click="cancel()" class="close">&times;</a>
      </div>
      <form @submit.prevent="saveProfileSettings()" autocomplete="off">
        <div class="modal-body">
            <label class="form-label">
              Profile Picture
              <input type="file" class="form-control" @change="update" accept="image/*">
            </label>
            <div id="preview"></div>
            <label class="form-label">
              First Name
              <input type="text" class="form-control" v-model="cloneUserProfile.firstname" maxlength="40">
            </label>
            <label class="form-label">
              Last Name
              <input type="text" class="form-control" v-model="cloneUserProfile.lastname" maxlength="40">
            </label>
            <label class="form-label">
              Email
              <input type="email" class="form-control" v-model="cloneUserProfile.email" required maxlength="40">
            </label>
            <label class="form-label">
              Phone
              <input id="phoneNumber" type="tel" class="form-control" v-model="cloneUserProfile.phone" @keypress="numberPressed" minlength="16" maxlength="16">
            </label>
            <label class="form-label">
              Zip
              <input type="text" class="form-control" v-model="cloneUserProfile.zipcode" @keypress="numberPressed" minlength="5" maxlength="5">
            </label>
          <div class="alert alert-danger" v-if="phoneInputError">
            <p>{{ phoneInputError }}</p>
          </div>
        </div>
      </form>
      <div class="modal-footer text-right">
        <input type="button" class="btn btn-danger cancel" value="Cancel" @click="cancel()">
        <input type="submit" class="btn btn-primary" value="Save Changes" @click="saveProfileSettings()">
      </div>
    </post-modal>
  </transition>
</template>

<script>
var _ = require('lodash')
import PostModal from './PostModal.vue'
import axios from 'axios'
export default {
  data () {
    return {
      cloneUserProfile: {},
      updateUser: {
        id: '',
        picid: '',
        url: '',
        firstname: '',
        lastname: '',
        items: [],
        email: '',
        phone: '',
        zip: ''
      },
      profileImage: '',
      phoneInputError: ''
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
      document.getElementById('phoneNumber').addEventListener('keyup', function (evt) {
        var phoneNumber = document.getElementById('phoneNumber')
        phoneNumber.value = phoneFormat(phoneNumber.value)
      })

      // We need to manually format the phone number on page load
      document.getElementById('phoneNumber').value = phoneFormat(document.getElementById('phoneNumber').value)
    }

    this.cloneUserProfile = _.cloneDeep(this.UserProfile)

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
    validateEmail (email) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
      } else {
        alert('You have entered an invalid email address!')
        this.userProfile.email = this.UserProfile.email
      }
    },
    update (event) {
      let vm = this
      let file = event.target.files[0]
      let picDisplayer = new FileReader()
      picDisplayer.onload = (function (file) {
        return function (event) {
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
        return function (event) {
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
              vm.updateUser.url = res.data.url
              vm.updateUser.picid = res.data.picid
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
    saveImage: function () {
      // Save the uploaded profile picture
      axios({
        method: 'put',
        url: this.updateUser.url,
        data: this.profileImage
      })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveProfileSettings () {
      this.userProfile = this.cloneUserProfile
      this.saveImage()
      // Makes sure to set up data object with all data needed for vuex call
      // *Honestly this is ridiculous and needs improvement, but it works for now*
      this.updateUser.id = this.getCurrentUser
      this.updateUser.firstname = this.cloneUserProfile.firstname
      this.updateUser.lastname = this.cloneUserProfile.lastname
      this.updateUser.email = this.cloneUserProfile.email
      this.updateUser.phone = this.cloneUserProfile.phone
      this.updateUser.items = this.cloneUserProfile.items
      this.updateUser.zipcode = this.cloneUserProfile.zipcode
      // Make API call to update the user info and refresh data on front-end
      axios({
        method: 'put',
        url: '/api/users/edit/' + this.getCurrentUser,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.updateUser
      })
        .then(res => {
          // Make API to get the user again to fully update the DOM data
          axios({
            method: 'get',
            url: '/api/users/' + this.getCurrentUser,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })
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
        })
        .catch(error => {
          console.log(error)
        })
      this.validateEmail(this.userProfile.email)
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
  },
  components: {
    postModal: PostModal
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
  h3 {
    display: inline;
  }
  .cancel {
    float: left;
  }
</style>
