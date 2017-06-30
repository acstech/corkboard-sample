<template>
  <post-modal>
    <div class="modal-header">
      <h3>New Post</h3>
      <router-link class="close" to="/">&times;</router-link>
    </div>

    <form @submit.prevent="savePost()">
    <div class="modal-body">
      <label class="form-label">
        Image
        <input class="form-control" name="files" id="files" type="file" multiple>
      </label>
      <div id="preview"></div>
      <label class="form-label">
        Title
        <p style="font-size: 12px">(Max 50 Characters)</p>
        <input v-model="newPost.itemname" class="form-control" maxlength="50" required>
      </label>
      <label class="form-label">
        Price
        <money v-model="newPost.itemprice" v-bind="moneyConfig" class="form-control currency"></money>
      </label>
      <label class="form-label">
        Description
        <textarea v-model="newPost.itemdesc" rows="5" class="form-control" required></textarea>
      </label>
      <label class="form-label">
        Category
        <select class="form-control" v-model="newPost.itemcat">
          <option>None</option>
          <option>Category 1</option>
          <option>Category 2</option>
          <option>Category 3</option>
        </select>
      </label>
    </div>

    <div class="modal-footer text-right">
    <p align="center">
      <input type="submit" class="btn btn-lg btn-default" value="Post!">
    </p>
    </div>
    </form>
  </post-modal>
</template>

<script>
  import PostModal from './PostModal.vue'
  import { Money } from 'v-money'
  import axios from 'axios'
  export default {
    // Will need more data attributes
    data () {
      return {
        newPost: {
          itemname: '',
          // pictures: [],
          itemprice: 0.00,
          itemdesc: '',
          itemcat: '',
          salestatus: 'Available'
        },
        moneyConfig: {
          // The character used to show the decimal place.
          decimal: '.',
          // The character used to separate numbers in groups of three.
          thousands: ',',
          // The currency name or symbol followed by a space.
          prefix: '$ ',
          // The suffix (If a suffix is used by the target currency.)
          suffix: '',
          // Level of decimal precision. REQUIRED
          precision: 2,
          // If mask is false, outputs the number to the model. Otherwise outputs the masked string.
          masked: true
        }
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
      savePost: function () {
        axios({
          method: 'post',
          url: '/api/items/new',
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          },
          data: this.newPost
        })
          .then(res => {
            console.log(res)
            this.newPost = {}
          })
          .catch(error => {
            console.log(error)
          })
        this.$router.push('/')
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
  span.glyphicon {
    font-size: 2.0em;
    color: black;
  }
  span.glyphicon:hover {
    color: maroon;
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
