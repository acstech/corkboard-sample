<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>New Post</h3>
        <router-link class="close" to="/">&times;</router-link>
      </div>

      <form enctype="multipart/form-data" @submit.prevent="savePost()">
      <div class="modal-body">
        <b>Image</b>
        <div class="dropbox">
          <input
            type="file"
            id="files"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="update"
            accept="image/*"
            class="input-file">
        </div>
        <a class="reset-option" @click="reset">Reset Uploads</a>
        <div v-if="isSuccess">
          <p>Uploaded successfully.</p>
        </div>
        <!--FAILED-->
        <div v-if="isFailed">
          <p>Upload failed.</p>
          <p>
            <a href="javascript:void(0)" @click="reset">Try again</a>
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
  </transition>
</template>

<script>
  import PostModal from './PostModal.vue'
  import { Money } from 'v-money'
  import { imagesLoaded, Masonry } from '../main'
  import axios from 'axios'
  // eslint-disable-next-line one-var
  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3
  export default {
    // Will need more data attributes
    data () {
      return {
        uploadedFiles: [],
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
      if (this.getToken === null) {
        this.$router.push('/login')
      }
    },
    methods: {
      reset () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.uploadError = null
        // Reset previous upload attempts and thumbnails
        let preview = document.getElementById('preview')
        preview.innerHTML = ''
        this.uploadedFiles = []
        this.uploadedFileURLs = []
        this.newPost.picid = []
      },
      update (event) {
        let vm = this
        // Grab the file object from the form input
        let files = event.target.files
        vm.currentStatus = STATUS_SAVING
        // Grab updated files in latest upload
        for (var i = 0; i < files.length; i++) {
          let file = files[i]
          // Don't do anything if it isn't an image
          if (!file.type.match('image')) {
            continue
          }
          // Setup a FileReader for uploading the preview to AddPost
          let picDisplayer = new FileReader()
          picDisplayer.onload = (function (file) {
            return function (event) {
              let picFile = event.target
              let preview = document.getElementById('preview')
              preview.innerHTML += "<img class='thumbnail' src='" + picFile.result + "'" +
                "title='" + file.name + "' width='150px' height='150px' style='display: inline'/>"
            }
          })(file)
          // Setup a FilerReader to generate a NewImageURL for each image
          let picHasher = new FileReader()
          picHasher.onload = (function (file) {
            return function (event) {
              // let hash = Crypto.MD5(picFile.result).toString()
              axios({
                method: 'post',
                url: '/api/image/new',
                data: {
                  extension: file.type.split('/')[1]
                },
                headers: {
                  'Authorization': 'Bearer ' + vm.$store.state.token
                }
              })
                .then(res => {
                  vm.currentStatus = STATUS_SUCCESS
                  // Push information about the file to the appropriate arrays
                  vm.uploadedFiles.push({file: file, url: res.data.url})
                  vm.newPost.picid.push(res.data.picid)
                })
                .catch(err => {
                  vm.uploadError = err.response
                  vm.currentStatus = STATUS_FAILED
                })
            }
          })(file)
          // Read the image
          picDisplayer.readAsDataURL(file)
          picHasher.readAsBinaryString(file)
          // upload data to the server
        }
      },
      saveImages: function () {
        // Save each uploaded picture by placing its data in each URL
        for (var i = 0; i < this.uploadedFiles.length; i++) {
          axios({
            method: 'put',
            url: this.uploadedFiles[i].url,
            // headers: {
            //   'Content-MD5': this.uploadedFiles[i].md5,
            //   'Content-Type': this.uploadedFiles[i].file.type
            // },
            data: this.uploadedFiles[i].file
          })
            .then(res => {
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
    box-shadow: 1px 1px 2px #4d4d4d;
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
    box-shadow: 1px 1px 2px #4d4d4d;
  }

  textarea {
    box-shadow: 1px 1px 2px #4d4d4d;
  }

  select {
    box-shadow: 1px 1px 2px #4d4d4d;
  }
</style>
