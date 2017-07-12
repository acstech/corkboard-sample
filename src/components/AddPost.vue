<template>
  <post-modal>
    <div class="modal-header">
      <h3>New Post</h3>
      <router-link class="close" to="/">&times;</router-link>
    </div>

    <form enctype="multipart/form-data" @submit.prevent="savePost()" novalidate>
    <div class="modal-body">
      <b>Image</b>
      <div class="dropbox">
        <input type="file" id="files" multiple :name="uploadFieldName" :disabled="isSaving" @change="update($event.target.files)" accept="image/*" class="input-file">
      </div>
      <div v-if="isSuccess">
        <p>Uploaded successfully.</p>
        <!--
        <ul class="list-unstyled">
          <li v-for="itemuploadedFileURLsiles">
            <img :src="item.url" class="thumbnail" :alt="item.originalName">
          </li>
        </ul>
        -->
      </div>
      <!--FAILED-->
      <div v-if="isFailed">
        <p>Upload failed.</p>
        <p>
          <a href="javascript:void(0)" @click="reset()">Try again</a>
        </p>
        <pre>{{ uploadError }}</pre>
      </div>
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
        <textarea v-model="newPost.itemdesc" rows="5" class="form-control" required maxlength="2000"></textarea>
      </label>
      <label class="form-label">
        Category
        <select class="form-control" v-model="newPost.itemcat">
          <option value="None">None</option>
          <option value="Category 1">Category 1</option>
          <option value="Category 2">Category 2</option>
          <option value="Category 3">Category 3</option>
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
  import { imagesLoaded, Masonry } from '../main'
  import axios from 'axios'
  import Crypto from 'crypto-js'
  // eslint-disable-next-line one-var
  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3
  export default {
    // Will need more data attributes
    data () {
      return {
        uploadedFiles: [],
        uploadedFileURLs: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'Image',
        newPost: {
          itemname: '',
          picid: [],
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
    computed: {
      isInitial () {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving () {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess () {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed () {
        return this.currentStatus === STATUS_FAILED
      },
      getToken () {
        return this.$store.state.token
      }
    },
    mounted () {
      // Check File API support
      if (this.getToken === null) {
        this.$router.push('/login')
      }
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
    },
    methods: {
      reset () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.uploadedFileURLs = []
        this.uploadError = null
      },
      update (files) {
        // Pull image data needed for new image request
        var imageReq = {checksum: '', extension: ''}
        this.currentStatus = STATUS_SAVING
        for (var i = 0; i < files.length; ++i) {
          // Grab checksum and extension
          imageReq.checksum = Crypto.MD5(files[i]).toString()
          imageReq.extension = files[i].type.substring(6)
          console.log(imageReq.checksum)
          this.uploadedFiles.push(files[i])
          // upload data to the server
          axios({
            method: 'post',
            url: '/api/image/new',
            headers: {
              'Authorization': 'Bearer ' + this.getToken
            },
            data: imageReq
          })
            .then(res => {
              this.currentStatus = STATUS_SUCCESS
              // Place URL and ID in new post data for saving
              this.uploadedFileURLs.push(res.data.url)
              this.newPost.picid.push(res.data.picid)
            })
            .catch(err => {
              this.uploadError = err.response
              this.currentStatus = STATUS_FAILED
            })
        }
      },
      saveImages: function () {
        // Save each uploaded picture by placing its data in each URL
        for (var i = 0; i < this.newPost.picid.length; ++i) {
          axios({
            method: 'put',
            url: this.uploadedFileURLs[i],
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            },
            data: this.uploadedFiles[i]
          })
            .then(res => {
              console.log(res)
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      savePost: function () {
        // Populate image data and save to the URL before adding the post
        this.saveImages()
        axios({
          method: 'post',
          url: '/api/items/new',
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          },
          data: this.newPost
        })
          .then(res => {
            console.log(res.data)
            let vm = this
            setTimeout(function () {
              // Retrieve all items call to API
              axios({
                method: 'get',
                url: '/api/items',
                headers: {
                  'Authorization': 'Bearer ' + vm.$store.state.token
                }
              })
                .then(res2 => {
                  vm.$store.commit('getAllPosts', res2.data)
                  var posts = document.querySelectorAll('.grid-item')
                  imagesLoaded(posts, function () {
                    // eslint-disable-next-line no-unused-vars
                    var masonry = new Masonry('.grid', {
                      selector: '.grid-item',
                      columnWidth: '.grid-sizer',
                      percentPosition: true
                    })
                  })
                })
                .catch(error => {
                  if (error.response.status === 401) {
                    vm.$router.push('/signup')
                  }
                })
              vm.newPost = {}
              vm.newPost.itemprice = 0.00
            }, 300)
          })
          .catch(error => {
            console.log(error)
            // Token expiry
            if (error.response.status === 401) {
              this.$store.commit('authenticate', null)
              let vm = this
              setTimeout(function () {
                vm.$router.push('/login')
              }, 100)
            }
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
  .dropbox {
    justify-content: center;
  }
  .input-file {
    box-shadow: 4px 4px 5px #4d4d4d;
    min-height: 30px;
    padding: 4px;
    margin-left: 23%;
    margin-top: 6px;
    margin-bottom: 10px;
  }
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
  input {
    box-shadow: 3px 3px 5px #4d4d4d;
  }

  textarea {
    box-shadow: 3px 3px 5px #4d4d4d;
  }

  select {
    box-shadow: 3px 3px 5px #4d4d4d;
  }
</style>
