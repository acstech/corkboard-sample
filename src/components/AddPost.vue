<template>
    <div id="new-post-modal-template">
        <post>
            <div class="modal-header">
                <h3>New Post</h3>
            </div>

            <div class="modal-body">
                <label class="form-label">
                    Title
                    <input v-model="title" class="form-control">
                </label>
                <label class="form-label">
                    Price
                    <input v-model="price" class="form-control">
                </label>
                <label class="form-label">
                    Description
                    <textarea v-model="description" rows="5" class="form-control"></textarea>
                </label>
            </div>

            <div class="modal-footer text-right">
                <button class="btn btn-primary" @click="savePost()">
                    <router-link to="/">Add Post</router-link>
                </button>
            </div>
        </post>
    </div>
</template>

<script>
import Post from './Post.vue'
export default {
  // Will need more data attributes
  data () {
    return {
      title: '',
      price: '',
      description: ''
    }
  },
  methods: {
    close: function () {
      this.title = ''
      this.price = ''
      this.description = ''
    },
    savePost: function () {
      // Insert AJAX call here...
      this.close()
    }
  },
  components: {
    post: Post
  }
}
</script>

<style scoped>

</style>
