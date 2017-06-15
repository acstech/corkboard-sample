<template>
  <div id="new-post-modal-template">
    <post>
      <div class="modal-header">
        <h3>New Post</h3>
        <router-link class="close" to="/">X</router-link>
      </div>

      <div class="modal-body">
        <label class="form-label">
          Image
          <input name="files" id="files" type="file" multiple>
        </label>
        <div id="preview"></div>
        <label class="form-label">
          Title
          <input v-model="title" class="form-control">
        </label>
        <label class="form-label">
          Price
          $<input v-model="price" class="form-control currency" type="number" min="0.00" step="0.50">
        </label>
        <label class="form-label">
          Description
          <textarea v-model="description" rows="5" class="form-control"></textarea>
        </label>
      </div>

      <div class="modal-footer text-right">
        <button class="btn btn-danger cancel">
          <router-link to="/"><span>Cancel</span></router-link>
        </button>
        <button class="btn btn-primary" @click="savePost()">
          <router-link to="/"><span>Add Post</span></router-link>
        </button>
      </div>
    </post>
  </div>
</template>

<script>
  import Post from './PostModal.vue'
  export default {
    // Will need more data attributes
    data () {
      return {
        title: '',
        pictures: [],
        price: '',
        description: ''
      }
    },
    mounted () {
      // Check File API support
      if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById('files')
        filesInput.onchange = function (event) {
          var files = event.target.files // FileList object
          for (var i = 0; i < files.length; i++) {
            var file = files[i]
            // Only preview images
            if (!file.type.match('image')) {
              continue
            }
            var picReader = new FileReader()
            picReader.onload = function (event) {
              var picFile = event.target
              var preview = document.getElementById('preview')
              preview.innerHTML += "<img class='thumbnail' src='" + picFile.result + "'" +
                "title='" + picFile.name + "' width='150px' height='150px' style='display: inline'/>"
            }
            // Read the image
            picReader.readAsDataURL(file)
          }
        }
      } else {
        console.log('Your browser does not support File API')
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
  .thumbnail {
    display: inline;
    width: 100px;
    height: 100px;
    margin: 10px;
  }
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
  .currency {
    position: relative;
    width: 30%;
    left: 35%;
  }
</style>
