<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Post</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
    </div>

    <div class="modal-body">
      <form>
        <label class="form-label">
          Pictures
          <input type="file" class="form-control" multiple>
        </label>
        <label class="form-label">
          Title
          <input type="text" class="form-control">
        </label>
        <label class="form-label">
          Price
          <input type="text" class="form-control">
        </label>
        <label class="form-label">
          Description
          <textarea rows="5" class="form-control"></textarea>
        </label>
        <label class="form-label">
          Category
          <select class="form-control">
            <option>None</option>
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
          </select>
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
