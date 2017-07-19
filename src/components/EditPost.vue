<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>Edit Post</h3>
        <a class="close" @click="cancel()">&times;</a>
      </div>

      <form @submit.prevent="updatePost">
        <div class="md-form">
          <label for="files" class="control-label">Images</label>
          <div class="btn btn-primary btn-sm">
            <span>Choose Files</span>
            <input type="file" id="files" class="input-file" @change="update" accept="image/*" multiple>
          </div>
          <p v-if="!validImageSize">Please upload an image under 5MB.</p>
          <p v-if="!validNumOfImages">Too many selected images! Try uploading again.</p>
          <p @click="reset" style="cursor:pointer">Reset Uploads</p>
          <div id="preview">
            <img class="thumbnail" v-for="(imgSrc,index) in this.currentPost.url" :src=imgSrc>
          </div>
        </div>
        <label class="edit-label">Title</label>
        <div class="md-form">
          <input type="text" v-model="currentPost.itemname" class="form-control" maxlength="50" required>
        </div>
        <label class="edit-label">Price</label>
        <div class="md-form">
          <money v-model="currentPost.itemprice" v-bind="moneyConfig" class="form-control currency"></money>
        </div>
        <label class="edit-label">Description</label>
        <div class="md-form">
          <textarea rows="5" class="md-textarea" v-model="currentPost.itemdesc" maxlength="2000" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">
            Category
            <select class="form-control" v-model="currentPost.itemcat">
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
          </label>
        </div>
          <label class="form-label">
            Sale Status:
            <input type="radio" v-model="currentPost.salestatus" name="salestatus" value="Available" style="box-shadow:none"> Available
            <input type="radio" v-model="currentPost.salestatus" name="salestatus" value="Sale Pending" style="box-shadow:none"> Sale Pending
          </label>
      <div class="modal-footer text-right">
        <button class="btn btn-danger cancel" @click.prevent="cancel()">Cancel</button>
        <input type="submit" class="btn btn-primary" value="Save Changes">
      </div>
      </form>
    </post-modal>
  </transition>
</template>

<script>
import PostModal from './PostModal.vue'
import { Money } from 'v-money'
import axios from 'axios'
import { Masonry, imagesLoaded } from '../main'
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
      clonePost: {
        picid: []
      },
      updatedPost: {
        itemname: '',
        itemprice: 0.00,
        itemdesc: '',
        itemcat: '',
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
      validNumOfImages: true
    }
  },
  mounted () {
    if (this.getToken === null) {
      this.router.push('/login')
    }
  },
  methods: {
    reset () {
      // this.validNumOfImages = true
      this.uploadError = null
      this.uploadedFiles = []
      this.uploadedFileURLs = []
      this.clonePost.picid = []
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
      vm.numImages = vm.clonePost.picid.length
      vm.numImages2 = vm.currentPost.picid.length
      // Check against the 5 maximum images constraint
      if (vm.wasreset) {
        console.log(files.length + vm.numImages)
        if (files.length + vm.numImages > 5) {
          vm.validNumOfImages = false
          return
        }
      } else {
        console.log(files.length + vm.numImages2)
        if (files.length + vm.numImages2 > 5) {
          vm.validNumOfImages = false
          return
        }
      }
      // Grab updated files in latest upload
      for (var i = 0; i < files.length; ++i) {
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
                'Authorization': 'Bearer ' + vm.getToken
              }
            })
              .then(res => {
                // Place URL and ID in new post data for saving
                vm.uploadedFiles.push({file: file, url: res.data.url})
                vm.clonePost.picid.push(res.data.picid)
                vm.currentPost.picid.push(res.data.picid)
              })
              .catch(err => {
                vm.uploadError = err.response
              })
          }
        })(file)
        // Read the image
        picDisplayer.readAsDataURL(file)
        picHasher.readAsBinaryString(file)
      }
    },
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
    updatePost () {
      // Save the image uploads
      this.saveImages()
      // Set the rest of the data to update or persist
      this.updatedPost.itemid = this.currentPost.itemid // Should not change
      this.updatedPost.itemname = this.currentPost.itemname
      this.updatedPost.itemdesc = this.currentPost.itemdesc
      this.updatedPost.itemcat = this.currentPost.itemcat
      this.updatedPost.picid = this.currentPost.picid
      this.updatedPost.itemprice = this.currentPost.itemprice
      this.updatedPost.salestatus = this.currentPost.salestatus
      // Make a call to Corkboard API to update the edited post
      axios({
        method: 'put',
        url: '/api/items/edit/' + this.currentPost.itemid,
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
              // Reset masonry layout to prevent tile display issues
              var posts = document.querySelectorAll('.grid')
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
    postModal: PostModal,
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
  span.glyphicon-arrow-left {
    font-size: 2.0em;
    color: black;
  }
  span.glyphicon-arrow-left:hover {
    color: lightgray;
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
</style>
