<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Profile</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
    </div>

    <div class="modal-body">
      <form>
        <label class="form-label">
          Profile Picture
          <input type="file" class="form-control">
        </label>
        <label class="form-label">
          First Name
          <input type="text" class="form-control" v-model="user.firstname">
        </label>
        <label class="form-label">
          Last Name
          <input type="text" class="form-control" v-model="user.lastname">
        </label>
        <label class="form-label">
          Email
          <input type="email" class="form-control" v-model="user.email">
        </label>
      </form>
    </div>

    <div class="modal-footer text-right">
      <button class="btn btn-danger cancel">
        <router-link to="/viewProfile/1"><span>Cancel</span></router-link>
      </button>
      <button class="btn btn-primary">
        <router-link to="/viewProfile/1"><span>Save Changes</span></router-link>
      </button>
    </div>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
export default {
  data () {
    return {
      user: {
        profilePic: null,
        firstName: '',
        lastName: '',
        email: ''
      }
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
