<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Profile</h3>
      <a @click="cancel()" class="close">&times;</a>
    </div>
    <form @submit.prevent="saveProfileSettings(userProfile)">
    <div class="modal-body">
        <label class="form-label">
          Profile Picture
          <input type="file" class="form-control">
        </label>
        <label class="form-label">
          First Name
          <input type="text" class="form-control" v-model="userProfile.firstname">
        </label>
        <label class="form-label">
          Last Name
          <input type="text" class="form-control" v-model="userProfile.lastname">
        </label>
        <label class="form-label">
          Email
          <input type="email" class="form-control" v-model="userProfile.email" required maxlength="40">
        </label>
        <label class="form-label">
          Phone
          <input id="phoneNumber" type="tel" class="form-control" v-model.lazy="userProfile.phone" @keypress="numberPressed" maxlength="16">
        </label>
      <!-- For later. API needs to accept this into JSON before use
        <label class="form-label">
          Zip
          <input type="number" min="0" step="1" class="form-control" v-model="userProfile.zip">
        </label>
        -->
    </div>

    <div class="modal-footer text-right">
      <input type="button" class="btn btn-danger cancel" value="Cancel" @click="cancel()">
      <input type="submit" class="btn btn-primary" value="Save Changes">
    </div>
    </form>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
// eslint-disable-next-line no-unused-varss
import axios from 'axios'
export default {
  computed: {
    userProfile () {
      return this.$store.state.viewedUserProfile
    },
    getCurrentUser () {
      return this.$store.state.currentUser
    }
  },
  mounted () {
    document.getElementById('phoneNumber').addEventListener('keyup', function (evt) {
      var phoneNumber = document.getElementById('phoneNumber')
      phoneNumber.value = phoneFormat(phoneNumber.value)
    })

    // We need to manually format the phone number on page load
    document.getElementById('phoneNumber').value = phoneFormat(document.getElementById('phoneNumber').value)

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
    saveProfileSettings (user) {
      axios({
        method: 'put',
        url: '/api/users/edit/' + this.getCurrentUser,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.userProfile
      })
        .then(res => {
          console.log(res)
          this.$store.commit('getViewedProfile', user)
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        })
        .catch(error => {
          console.log(error)
        })
    },
    numberPressed (evt) {
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
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
