<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>New Post</h3>
        <router-link class="close" to="/">&times;</router-link>
      </div>

      <form enctype="multipart/form-data" @submit.prevent="savePost()">
        <fieldset>
          <div class="form-group label-floating">
            <label for="files" class="control-label">Images</label>

              <input  type="file"
                      id="files"
                      multiple
                      :name="uploadFieldName"
                      :disabled="isSaving"
                      @change="update"
                      accept="image/*"
                      class="input-file">
            <p v-if="!validImageSize">Please upload an image under 5MB.</p>
            <p v-if="!validNumOfImages">Too many selected images! Try uploading again.</p>
            <a class="reset-option" @click="reset" style="cursor:pointer">Reset Uploads</a>
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
          </div>
          <div class="form-group label-floating">
            <label for="title" class="control-label">Title</label>
            <input v-model="newPost.itemname" id="title" class="form-control" maxlength="50" required>
          </div>
          <div class="form-group">
            <label class="control-label">Price</label>
            <money style="padding-right: 4px" v-model="newPost.itemprice" id="price" v-bind="moneyConfig" class="form-control currency"></money>
          </div>
          <div class="form-group">
            <label class="control-label">Description</label>
              <textarea v-model="newPost.itemdesc" rows="5" class="form-control" required maxlength="2000"></textarea>
          </div>
          <div class="form-group">
            <label class="control-label">Category</label>
              <select class="form-control" v-model="newPost.itemcat">
                <option value="None">None</option>
                <option value="Apparel">Apparel</option>
                <option value="Appliances">Appliances</option>
                <option value="Books and Movies">Books and Movies</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Pets">Pets</option>
                <option value="Toys and Games">Toys and Games</option>
                <option value="Other">Other</option>
              </select>
          </div>
        </fieldset>

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
        },
        validImageSize: true,
        validNumOfImages: true
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
      // reset form to initial state
      reset () {
        this.currentStatus = STATUS_INITIAL
        this.uploadError = null
        this.uploadedFiles = []
        this.uploadedFileURLs = []
        this.newPost.picid = []
        // Reset previous upload attempts and thumbnails
        let preview = document.getElementById('preview')
        preview.innerHTML = ''
      },
      update (event) {
        let vm = this
        vm.validImageSize = true
        vm.validNumOfImages = true
        // Grab the file object from the form input
        let files = event.target.files
        // Check against the 5 maximum images constraint
        if (files.length > 5) {
          vm.validNumOfImages = false
          return
        }
        vm.currentStatus = STATUS_SAVING
        // Grab updated files in latest upload
        for (var i = 0; i < files.length; i++) {
          let file = files[i]
          // Don't do anything if it isn't an image
          if (!file.type.match('image')) {
            continue
          }
          // For now, only allow images less than 5MB in size
          if (file.size > 5000000) {
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
              preview.innerHTML += "<img class='thumbnail' src='" + picFile.result + "'" +
                "title='" + file.name + "' width='150px' height='150px' style='display: inline'/>"
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
            // TODO: Conditional of where to make an axios call and final route depending on source page
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
                  // Reset masonry layout to prevent tile display issues
                  var posts = document.querySelectorAll('.grid-item')
                  imagesLoaded(posts, function () {
                    // eslint-disable-next-line no-unused-vars
                    var masonry = new Masonry('.grid', {
                      selector: '.grid-item',
                      columnWidth: 450,
                      percentPosition: true
                    })
                  })
                })
                .catch(error => {
                  // Route unauthenticated users to login
                  if (error.response.status === 401) {
                    vm.$router.push('/login')
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
  fieldset {
    margin-top: 12px;
    margin-bottom: 12px;
  }
</style>
