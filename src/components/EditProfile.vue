<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Profile</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
    </div>
    <form @submit="saveProfileSettings(userProfile)">
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
          <input type="email" class="form-control" v-model="userProfile.email">
        </label>
        <label class="form-label">
          Phone
          <input type="tel" class="form-control" v-model="userProfile.phone">
        </label>
    </div>

    <div class="modal-footer text-right">
      <router-link to="/viewProfile/1"><input type="button" class="btn btn-danger cancel" value="Cancel"></router-link>
      <router-link to="/viewProfile/1"><input type="submit" class="btn btn-primary" value="Save Changes"></router-link>
    </div>
    </form>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
export default {
  computed: {
    userProfile () {
      return this.$store.state.viewedUserProfile
    }
  },
  methods: {
    saveProfileSettings (user) {
      this.$store.commit('getViewedProfile', user)
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
