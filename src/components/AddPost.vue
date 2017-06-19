<template>
    <post-modal>
      <div class="modal-header">
        <h3>New Post</h3>
        <router-link class="close" to="/">&times;</router-link>
      </div>

      <div class="modal-body">
        <label class="form-label">
          Image
          <input class="form-control" name="files" id="files" type="file" multiple>
        </label>

        <div id="preview"></div>
        <label class="form-label">
          Title
          <input v-model="title" class="form-control">
        </label>

        <label class="form-label">
          Price
          $ <input v-model="price" class="form-control currency" type="number" min="0.00" step="0.50">
        </label>

        <label class="form-label">
          Description
          <textarea v-model="description" rows="5" class="form-control"></textarea>
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
      </div>

      <div class="modal-footer text-right">
        <router-link to="/"><button class="btn btn-danger cancel">
          <span>Cancel</span>
        </button></router-link>
        <router-link to="/"><button class="btn btn-primary" @click="savePost()">
          <span>Add Post</span>
        </button></router-link>
      </div>
    </post-modal>
</template>

<script>

  import PostModal from './PostModal.vue'
  import { Money } from 'v-money'
  export default {
    // Will need more data attributes

    data () {
      return {
        title: '',
        pictures: [],
        description: '',
        price: ''
      }
    },
    mounted () {
      // Check File API support
      if (window.File && window.FileList && window.FileReader) {
        let filesInput = document.getElementById('files')
        filesInput.onchange = function (event) {
          let files = event.target.files // FileList object
          for (var i = 0; i < files.length; i++) {
            let file = files[i]
            // Only preview images
            if (!file.type.match('image')) {
              continue
            }
            let picReader = new FileReader()
            picReader.onload = function (event) {
              let picFile = event.target
              let preview = document.getElementById('preview')
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
      postModal: PostModal,
      money: Money
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
