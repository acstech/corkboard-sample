<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Profile</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
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
          <input type="email" class="form-control" v-model="userProfile.email" required>
        </label>
        <label class="form-label">
          Phone
          <input type="tel" class="form-control" v-model="userProfile.phone">
        </label>
        <label class="form-label">
          Zip
          <input type="number" min="0" step="1" class="form-control" v-model="userProfile.zip">
        </label>
    </div>

    <div class="modal-footer text-right">
      <router-link to="/viewProfile/1"><input type="button" class="btn btn-danger cancel" value="Cancel"></router-link>
      <input type="submit" class="btn btn-primary" value="Save Changes">
    </div>
    </form>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
export default {
  computed: {
    userProfile () {
      return this.$store.state.viewedUserProfile
    }
  },
  methods: {
    saveProfileSettings (user) {
      // TODO: Need user id somehow to route correctly!
      axios({
        method: 'put',
        url: '/api/users/edit/' + this.userProfile.id,

        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },

        data: this.credentials
      })
        .then(res => {
          console.log(res)
          this.$store.commit('getViewedProfile', user)
          this.$router.push('/viewProfile/' + this.userProfile.id)
        })
        .catch(error => {
          console.log(error)
        })
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
