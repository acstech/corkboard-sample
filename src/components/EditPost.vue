<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Post</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
    </div>

    <div class="modal-body">
      <div>Form for changing data would go here.</div>
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
