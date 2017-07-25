<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" @click="close" v-show="show" transition="modal">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">

        <a class="close" @click="cancel()">&times;</a>

        <div class="modal-header">
          <h3>Edit Post</h3>
        </div>

        <form @submit.prevent="updatePost">
          <label for="files" style="color: #5a5a5a; margin-top: 10px; font-size: 14px">Images</label>
          <div class="md-form flex-center file-upload">
            <input
              type="file"
              id="files"
              class="input-file btn btn-blue-grey"
              @change="update"
              accept="image/jpeg,image/jpg,image/png"
              multiple
            >
          </div>
          <p v-if="!validImageSize">Please upload an image under 5MB.</p>
          <p v-if="!validNumOfImages">Too many selected images! Try uploading again.</p>
          <button v-if="uploadedFiles.length > 0 || currentPost.url.length > 0" @click.prevent="reset"
                  class="btn btn-sm btn-blue-grey" style="cursor:pointer">Reset Uploads
          </button>
          <br>
          <svg class="circular-loader" v-if="isLoading">
            <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#67737f" stroke-width="2"/>
          </svg>
          <!-- Where the image thumbnails appear on upload -->
          <div id="preview">
            <img class="thumbnail" v-for="(imgSrc,index) in this.currentPost.url" :src=imgSrc>
          </div>
          <label class="edit-label">Title</label>
          <div class="md-form">
            <input
              type="text"
              v-model="currentPost.name"
              class="form-control"
              maxlength="50"
              required
            >
          </div>
          <label class="edit-label">Price</label>
          <div class="md-form">
            <money
              v-model="currentPost.price"
              v-bind="moneyConfig"
              class="form-control currency">
            </money>
          </div>
          <label class="edit-label">Description</label>
          <div class="md-form">
            <textarea
              rows="5"
              class="md-textarea"
              v-model="currentPost.description"
              maxlength="500"
              required>
            </textarea>
          </div>
          <div class="form-group">
            <label class="form-label">
              Category
              <select class="form-control" v-model="currentPost.category">
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
            </label>
          </div>
          <label class="form-label">
            Sale Status:
            <input
              type="radio"
              v-model="currentPost.salestatus"
              name="salestatus"
              value="Available"
              style="box-shadow:none"> Available
            <input
              type="radio"
              v-model="currentPost.salestatus"
              name="salestatus"
              value="Sale Pending"
              style="box-shadow:none"> Sale Pending
          </label>

          <div class="modal-footer text-right">
            <button class="btn btn-danger cancel" @click.prevent="cancel()">Cancel</button>
            <input type="submit" class="btn btn-mdb" value="Save Changes">
          </div>
        </form>

      </div>
    </div>
  </transition>
</template>

<script>
  import { Money } from 'v-money'
  import axios from 'axios'

  export default {
    computed: {
      currentPost () {
        return this.$store.state.activePost
      },
      getCurrentUser () {
        return this.$store.state.currentUser
      },
      getToken () {
        return this.$store.state.token
      }
    },
    data () {
      return {
        // A check for whether the modal should be shown
        show: true,
        clonePost: {
          picid: []
        },
        countPost: {
          picid: []
        },
        updatedPost: {
          name: '',
          price: 0.00,
          description: '',
          category: '',
          salestatus: '',
          picid: []
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
        uploadedFiles: [],
        uploadedFileURLs: [],
        wasreset: false,
        numImages: 0,
        numimages2: 0,
        validImageSize: true,
        validNumOfImages: true,
        isLoading: false
      }
    },
    mounted () {
      if (this.getToken === null) {
        this.$router.push('/login')
      } else if (this.getCurrentUser !== this.currentPost.userid) {  // Temp fix
        this.$router.push('/')
      }
      // Allows modal close when pressing the ESC key
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.$router.push('/viewProfile/' + this.getCurrentUser)
        }
      })
    },
    methods: {
      // Closes the modal if its background is clicked
      close () {
        this.$router.push('/viewProfile/' + this.getCurrentUser)
        this.show = false
      },
      reset () {
        // this.validNumOfImages = true
        this.uploadError = null
        this.uploadedFiles = []
        this.uploadedFileURLs = []
        this.clonePost.picid = []
        this.countPost.picid = []
        this.wasreset = true
        // Reset previous upload attempts and thumbnails
        let preview = document.getElementById('preview')
        preview.innerHTML = ''
      },
      update (event) {
        let vm = this
        vm.validImageSize = true
        vm.validNumOfImages = true
        let files = event.target.files
        vm.numImages = vm.countPost.picid.length
        vm.numImages2 = vm.currentPost.picid.length
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
        for (var i = 0; i < files.length; ++i) {
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
                  'Authorization': 'Bearer ' + vm.getToken
                }
              })
                .then(res => {
                  // Place URL and ID in new post data for saving
                  vm.isLoading = false
                  vm.uploadedFiles.push({file: file, url: res.data.url})
                  vm.countPost.picid.push(res.data.picid)
                  vm.clonePost.picid.push(res.data.picid)
                  vm.currentPost.picid.push(res.data.picid)
                })
                .catch(err => {
                  vm.isLoading = false
                  vm.uploadError = err.response
                })
            }
          })(file)
          // Read the image
          picDisplayer.readAsDataURL(file)
          picHasher.readAsBinaryString(file)
        }
      },
      // If images changes in user posts, this function saves the changes
      saveImages: function () {
        if (this.wasreset === true) {
          var newpicid = []
          for (var j = 0; j < this.clonePost.picid.length; j++) {
            if (this.currentPost.picid.includes(this.clonePost.picid[j])) {
              newpicid.push(this.clonePost.picid[j])
            } else {
              newpicid.push(this.clonePost.picid[j])
            }
          }
          for (var k = 0; k < this.currentPost.picid.length; k++) {
            if (this.clonePost.picid.includes(this.currentPost.picid[k])) {
              continue
            } else {
              axios({
                method: 'delete',
                url: '/api/images/delete/' + this.currentPost.picid[k],
                data: this.currentPost.picid[k],
                headers: {
                  'Authorization': 'Bearer ' + this.$store.state.token
                }
              })
                .then(res => {
                })
                .catch(error => {
                  console.log(error)
                })
            }
          }
          this.currentPost.picid = newpicid
        }
        // Save each uploaded picture by placing its data in each URL
        for (var i = 0; i < this.uploadedFiles.length; ++i) {
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
      // Updates all changes to the user's post
      updatePost () {
        // Save the image uploads
        this.saveImages()
        // Set the rest of the data to update or persist
        this.updatedPost.id = this.currentPost.id // Should not change
        this.updatedPost.name = this.currentPost.name
        this.updatedPost.description = this.currentPost.description
        this.updatedPost.category = this.currentPost.category
        this.updatedPost.picid = this.currentPost.picid
        this.updatedPost.price = this.currentPost.price
        this.updatedPost.salestatus = this.currentPost.salestatus
        // Make a call to Corkboard API to update the edited post
        axios({
          method: 'put',
          url: '/api/items/edit/' + this.currentPost.id,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          },
          data: this.updatedPost
        })
          .then(res => {
            // Call the Corkboard API to retrieve user info again after
            // updating the post.
            axios({
              method: 'get',
              url: '/api/users/' + this.getCurrentUser,
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.token
              }
            })
              .then(res => {
                this.$store.commit('getViewedProfile', res.data)
              })
              .catch(error => {
                console.log(error)
              })
            this.$router.push('/viewProfile/' + this.getCurrentUser)
          })
          .catch(error => {
            console.log(error)
          })
      },
      cancel () {
        this.$router.push('/viewProfile/' + this.getCurrentUser)
      }
    },
    components: {
      money: Money
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

  .file-upload {
    margin-bottom: 0;
  }

  h3 {
    display: inline;
  }

  .cancel {
    float: left;
  }

  [type="radio"] {
    margin-left: 8px;
    margin-right: 2px;
  }

  .edit-label {
    float: left;
    color: #5a5a5a;
  }

  .thumbnail {
    width: 150px;
    height: 150px;
    display: inline;
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
