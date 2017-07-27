<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" @click="close" v-show="show">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">

        <a class="close" @click="cancel">&times;</a>

        <div class="modal-header">
          <h3>New Post</h3>
        </div>

        <form enctype="multipart/form-data" @submit.prevent="savePost()">
          <!-- Image Upload Input -->
          <label for="files" style="color: #5a5a5a; margin-top: 10px; font-size: 14px">Images</label>
          <div class="md-form flex-center file-upload">
            <input
              type="file"
              class="btn btn-blue-grey"
              @change="update"
              :name="uploadFieldName"
              accept="image/jpeg,image/jpg,image/png"
              id="files"
              multiple
            >
          </div>
          <p v-if="!validImageSize">Please upload an image under 5MB.</p>
          <p v-if="!validNumOfImages">Too many selected images! Try uploading again.</p>
          <button
            type="button"
            v-if="uploadedFiles.length > 0"
            class="btn btn-sm btn-blue-grey"
            @click="reset"
            style="cursor:pointer">
            Reset Uploads
          </button>
          <svg class="circular-loader" v-if="isLoading">
            <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#67737f" stroke-width="2"/>
          </svg>
          <div v-if="isSuccess">
            <p>Uploaded successfully.</p>
          </div>
          <!--FAILED-->
          <div v-if="isFailed">
            <p>Upload failed.</p>
            <p>
              <a @click="reset">Try again</a>
            </p>
            <pre>{{ uploadError }}</pre>
          </div>
          <!-- Where the image thumbnails appear on upload -->
          <div id="preview"></div>
          <!-- Item Name (Title) Input -->
          <div class="md-form">
            <input
              v-model="newPost.name"
              type="text"
              id="title"
              class="form-control"
              maxlength="50"
              required
            >
            <label for="title">Title</label>
          </div>
          <!-- Item Price Input -->
          <div class="md-form">
            <label>Price</label>
            <money
              v-model="newPost.price"
              id="price"
              minlength="0"
              maxlength="12"
              v-bind="moneyConfig"
              class="form-control currency">
            </money>
          </div>
          <!-- Item Description Input -->
          <div class="md-form">
            <textarea
              v-model="newPost.description"
              rows="5"
              class="md-textarea"
              required
              maxlength="500">
            </textarea>
            <label class="control-label">Description</label>
          </div>
          <!-- Item Category Input -->
          <div class="form-group">
            <label class="control-label">Category</label>
            <select class="form-control" v-model="newPost.category" required>
              <option value="None">None</option>
              <option value="Apparel">Apparel</option>
              <option value="Appliances">Appliances</option>
              <option value="Art & Decor">Art & Decor</option>
              <option value="Automotive">Automotive</option>
              <option value="Books and Movies">Books and Movies</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Pets">Pets</option>
              <option value="Toys and Games">Toys and Games</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="modal-footer">
            <p align="center">
              <input
                type="submit"
                class="btn btn-raised btn-mdb"
                value="Post!"
              >
            </p>
          </div>
        </form>

      </div>
    </div>
  </transition>
</template>

<script>
  import { Money } from 'v-money'
  import axios from 'axios'
  // eslint-disable-next-line one-var
  const STATUS_SUCCESS = 1, STATUS_FAILED = 0
  export default {
    // Will need more data attributes
    data () {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'Image',
        countPost: {
          picid: []
        },
        newPost: {
          name: '',
          picid: [],
          price: 0.00,
          description: '',
          category: '',
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
        },
        wasreset: false,
        numImages: 0,
        numImages2: 0,
        validImageSize: true,
        validNumOfImages: true,
        isLoading: false,
        show: true
      }
    },
    computed: {
      isSuccess () {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed () {
        return this.currentStatus === STATUS_FAILED
      },
      getCurrentUser () {
        return this.$store.state.currentUser
      },
      getToken () {
        return this.$store.state.token
      }
    },
    mounted () {
      if (this.getToken === null) {
        this.$router.push('/login')
      }
      // Allows modal close when pressing the ESC key
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 && (this.$route.path === '/addpost' || this.$route.path === '/')) {
          this.$router.push('/')
        } else if (e.keyCode === 27) {
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
      })
    },
    methods: {
      // Close the modal if its background is clicked
      close () {
        if (this.$route.path === '/addpost') {
          this.$router.push('/')
        } else {
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
        this.show = false
      },
      cancel () {
        if (this.$route.path === '/addpost') {
          this.$router.push('/')
        } else {
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
      },
      // Resets the file upload to its initial state
      reset () {
        this.currentStatus = null
        this.uploadError = null
        this.uploadedFiles = []
        this.uploadedFileURLs = []
        this.newPost.picid = []
        this.countPost.picid = []
        this.wasreset = true
        // Reset previous upload attempts and thumbnails
        let preview = document.getElementById('preview')
        preview.innerHTML = ''
      },
      // Updates the image uploads to the current state in preparation
      // for saving all post information
      update (event) {
        let vm = this
        vm.validImageSize = true
        vm.validNumOfImages = true
        // Grab the file object from the form input
        let files = event.target.files
        vm.numImages = vm.countPost.picid.length
        vm.numImages2 = vm.newPost.picid.length
        // Check against the 5 maximum images constraint
        if (vm.wasreset) {
          if (files.length + vm.numImages > 5) {
            vm.isLoading = false
            vm.validNumOfImages = false
            return
          }
        } else {
          if (files.length + vm.numImages2 > 5) {
            vm.isLoading = false
            vm.validNumOfImages = false
            return
          }
        }
        // Grab updated files in latest upload
        for (var i = 0; i < files.length; i++) {
          vm.isLoading = true
          let file = files[i]
          // Don't do anything if it isn't an image
          if (!file.type.match('image')) {
            continue
          }
          // For now, only allow images less than 5MB in size
          if (file.size > 5000000) {
            vm.isLoading = false
            vm.validImageSize = false
            return
          }
          // Setup a FileReader for uploading the preview to AddPost
          let picDisplayer = new FileReader()
          picDisplayer.onload = (function (file) {
            return function (event) {
              // Sets a preview thumbnail for the image(s)
              let picFile = event.target
              let preview = document.getElementById('preview')
              preview.innerHTML += '<img class=\'thumbnail\' src=\'' + picFile.result + '\'' +
                'title=\'' + file.name + '\' width=\'150px\' height=\'150px\' style=\'display: inline\'/>'
            }
          })(file)
          // Setup a FilerReader to generate a NewImageURL for each image
          let picHasher = new FileReader()
          picHasher.onload = (function (file) {
            return function () {
              // Calls the Corkboard API to set up the new image(s)
              // Returns a Picture ID (key) and URL
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
                  vm.isLoading = false
                  // Push information about the file to the appropriate arrays
                  vm.uploadedFiles.push({file: file, url: res.data.url})
                  vm.newPost.picid.push(res.data.picid)
                  vm.countPost.picid.push(res.data.picid)
                })
                .catch(err => {
                  vm.isLoading = false
                  vm.uploadError = err.response
                  vm.currentStatus = STATUS_FAILED
                })
            }
          })(file)
          // Read the image
          picDisplayer.readAsDataURL(file)
          picHasher.readAsBinaryString(file)
        }
      },
      // Saves each uploaded picture by placing its data in each URL
      saveImages: function () {
        for (var i = 0; i < this.uploadedFiles.length; i++) {
          axios({
            method: 'put',
            url: this.uploadedFiles[i].url,
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
        // Call the Corkboard API and save the new post's data
        if (this.$route.path === '/addpost') {
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
              // After saving the new post, call the API to retrieve all items after the recent
              // addition. Helps update the DOM appropriately
              setTimeout(function () {
                // Retrieve all items call to Corkboard API
                axios({
                  method: 'get',
                  url: '/api/items',
                  headers: {
                    'Authorization': 'Bearer ' + vm.$store.state.token
                  }
                })
                  .then(res2 => {
                    vm.$store.commit('getAllPosts', res2.data)
                  })
                  .catch(error => {
                    // Route unauthenticated users to login
                    if (error.response.status === 401) {
                      vm.$router.push('/login')
                    }
                  })
                vm.newPost = {}
                vm.newPost.price = 0.00
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
        } else {
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
              // After saving the new post, call the API to retrieve all items after the recent
              // addition. Helps update the DOM appropriately
              setTimeout(function () {
                // Call the Corkboard API to retrieve user info again after
                // adding the post.
                axios({
                  method: 'get',
                  url: '/api/users/' + vm.getCurrentUser,
                  headers: {
                    'Authorization': 'Bearer ' + vm.$store.state.token
                  }
                })
                  .then(res => {
                    vm.$store.commit('getViewedProfile', res.data)
                  })
                  .catch(error => {
                    console.log(error)
                  })
                vm.newPost = {}
                vm.newPost.price = 0.00
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
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
      }
    },
    components: {
      money: Money
    }
  }
</script>

<style scoped>
  .close {
    display: inline;
    float: right;
  }

  .file-upload {
    margin-bottom: 0;
  }

  .edit-label {
    float: left;
    color: #5a5a5a;
  }

  h3 {
    display: inline;
  }

  fieldset {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .circular-loader {
    -webkit-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
    height: 100px;
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
    width: 100px;
  }

  .loader-path {
    stroke-dasharray: 150, 200;
    stroke-dashoffset: -10;
    -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round;
  }

  @-webkit-keyframes rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }

  @-webkit-keyframes color {
    0% {
      stroke: #67737f;
    }
    40% {
      stroke: #67737f;
    }
    66% {
      stroke: #67737f;
    }
    80%, 90% {
      stroke: #67737f;
    }
  }

  @keyframes color {
    0% {
      stroke: #67737f;
    }
    40% {
      stroke: #67737f;
    }
    66% {
      stroke: #67737f;
    }
    80%, 90% {
      stroke: #67737f;
    }
  }
</style>
