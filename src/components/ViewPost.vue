<template>
  <post-modal>
    <div class="modal-header">
      <h3>Viewed Post Title</h3>
    </div>

    <div class="modal-body">
      <div>Images Here?</div>
      <img src="../assets/logo.png">
      <h4>Price Here</h4>
      <h4>Seller: Seller Name</h4>
      <p>Description</p>
    </div>

    <div class="modal-footer text-right">
      <button class="btn btn-danger cancel">
        <router-link to="/"><span>Cancel</span></router-link>
      </button>
      <button class="btn btn-primary">
        <router-link to="/"><span>Contact Seller</span></router-link>
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
  h3 {
    display: inline;
  }
  .cancel {
    float: left;
  }
  span:hover {
    text-decoration: none;
    color: white;
  }
</style>
