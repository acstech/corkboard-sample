<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <a @click="cancel()" class="close">&times;</a>
      </div>
      <form @submit.prevent="saveProfileSettings()">
      <div class="modal-body">
          <label class="form-label">
            Profile Picture
            <input type="file" class="form-control" @change="update($event.target.files)" accept="image/*">
          </label>
          <label class="form-label">
            First Name
            <input type="text" class="form-control" v-model.lazy="userProfile.firstname" maxlength="40">
          </label>
          <label class="form-label">
            Last Name
            <input type="text" class="form-control" v-model.lazy="userProfile.lastname" maxlength="40">
          </label>
          <label class="form-label">
            Email
            <input type="email" class="form-control" v-model.lazy="userProfile.email" required maxlength="40">
          </label>
          <label class="form-label">
            Phone
            <input id="phoneNumber" type="tel" class="form-control" v-model.lazy="userProfile.phone" @keypress="numberPressed" minlength="16" maxlength="16">
          </label>
          <label class="form-label">
            Zip
            <input type="text" class="form-control" v-model="userProfile.zipcode" @keypress="numberPressed" minlength="5" maxlength="5">
          </label>
        <div class="alert alert-danger" v-if="phoneInputError">
          <p>{{ phoneInputError }}</p>
        </div>
      </div>

      <div class="modal-footer text-right">
        <input type="button" class="btn btn-danger cancel" value="Cancel" @click="cancel()">
        <input type="submit" class="btn btn-primary" value="Save Changes">
      </div>
      </form>
    </post-modal>
  </transition>
</template>

<script>
import PostModal from './PostModal.vue'
import axios from 'axios'
import Crypto from 'crypto-js'
export default {
  data () {
    return {
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
    userProfile () {
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
    update (files) {
      // Pull image data needed for new image request
      var imageReq = {checksum: '', extension: ''}
      // Grab checksum and extension
      imageReq.checksum = Crypto.MD5(files[0]).toString()
      imageReq.extension = files[0].type.substring(6)
      console.log(imageReq.checksum)
      this.profileImage = files[0]
      // upload data to the server
      axios({
        method: 'post',
        url: '/api/image/new',
        headers: {
          'Authorization': 'Bearer ' + this.getToken
        },
        data: imageReq
      })
        .then(res => {
          // Save image Url and ID for later image saving and profile saving
          this.updateUser.url = res.data.url
          this.updateUser.picid = res.data.picid
        })
        .catch(err => {
          console.log(err)
        })
    },
    saveImage: function () {
      // Save the uploaded profile picture
      axios({
        method: 'put',
        url: this.updateUser.url,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.profileImage
      })
        .then(res => {
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveProfileSettings () {
      if (this.userProfile.phone.length !== 16) {
        this.phoneInputError = 'Please enter a full phone number.'
        return
      }
      this.saveImage()
      // Makes sure to set up data object with all data needed for vuex call
      // *Honestly this is ridiculous and needs improvement, but it works for now*
      this.updateUser.id = this.getCurrentUser
      this.updateUser.firstname = this.userProfile.firstname
      this.updateUser.lastname = this.userProfile.lastname
      this.updateUser.email = this.userProfile.email
      this.updateUser.phone = this.userProfile.phone
      this.updateUser.items = this.userProfile.items
      this.updateUser.zipcode = this.userProfile.zipcode
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
  .input-file {
    box-shadow: 1px 1px 2px #4d4d4d;
  }
  input {
    box-shadow: 1px 1px 2px #4d4d4d;
  }

  textarea {
    box-shadow: 1px 1px 2px #4d4d4d;
  }

  select {
    box-shadow: 1px 1px 2px #4d4d4d;
  }
</style>
