<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>Edit Post</h3>
        <a class="close" @click="cancel()">&times;</a>
      </div>

      <form @submit.prevent="updatePost">
      <div class="modal-body">
          <label class="form-label">
            Pictures
            <input type="file" id="files" class="form-control input-file" @change="update($event.target.files)" accept="image/*" multiple>
          </label>
          <div id="preview"></div>
          <label class="form-label">
            Title
            <p style="font-size: 12px">(Max 50 Characters)</p>
            <input type="text" v-model="currentPost.itemname" class="form-control" maxlength="50" required>
          </label>
          <label class="form-label">
            Price
            <money v-model="currentPost.itemprice" v-bind="moneyConfig" class="form-control currency"></money>
          </label>
          <label class="form-label">
            Description
            <textarea rows="5" class="form-control" v-model="currentPost.itemdesc" maxlength="2000" required></textarea>
          </label>
          <label class="form-label">
            Category
            <select class="form-control" v-model="currentPost.itemcat">
              <option value="None">None</option>
              <option value="Category 1">Category 1</option>
              <option value="Category 2">Category 2</option>
              <option value="Category 3">Category 3</option>
            </select>
          </label>
          <label class="form-label">
            Sale Status:
            <input type="radio" v-model="currentPost.salestatus" name="salestatus" value="Available" style="box-shadow:none"> Available
            <input type="radio" v-model="currentPost.salestatus" name="salestatus" value="Sale Pending" style="box-shadow:none"> Sale Pending
          </label>
      </div>

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
import Crypto from 'crypto-js'
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
      uploadedFileURLs: []
    }
  },
  mounted () {
    if (this.getToken === null) {
      this.router.push('/login')
    }
    let filesInput = document.getElementById('files')
    filesInput.onchange = function (event) {
      // Grab the file object from the form input
      let files = event.target.files
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
      this.uploadError = null
      // Reset previous upload attempts and thumbnails
      let preview = document.getElementById('preview')
      preview.innerHTML = ''
      this.uploadedFiles = []
      this.uploadedFileURLs = []
      this.updatedPost.picid = []
    },
    update (files) {
      // Pull image data needed for new image request
      var imageReq = {checksum: '', extension: ''}
      // Grab updated files in latest upload
      for (var i = 0; i < files.length; ++i) {
        // Grab checksum and extension
        // TODO: There seems to be a checksum generation issue. S3 will be upset
        imageReq.checksum = Crypto.MD5(files[i]).toString()
        imageReq.extension = files[i].type.substring(6)
        // console.log(imageReq.checksum)
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
            // Place URL and ID in new post data for saving
            this.uploadedFileURLs.push(res.data.url)
            this.updatedPost.picid.push(res.data.picid)
          })
          .catch(err => {
            this.uploadError = err.response
          })
      }
    },
    saveImages: function () {
      // Save each uploaded picture by placing its data in each URL
      for (var i = 0; i < this.updatedPost.picid.length; ++i) {
        axios({
          method: 'put',
          url: this.uploadedFileURLs[i],
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
    updatePost () {
      // Save the image uploads
      this.saveImages()
      // Set the rest of the data to update or persist
      this.updatedPost.itemid = this.currentPost.itemid // Should not change
      this.updatedPost.itemname = this.currentPost.itemname
      this.updatedPost.itemdesc = this.currentPost.itemdesc
      this.updatedPost.itemcat = this.currentPost.itemcat
      this.updatedPost.itemprice = this.currentPost.itemprice
      this.updatedPost.salestatus = this.currentPost.salestatus
      axios({
        method: 'put',
        url: '/api/items/edit/' + this.currentPost.itemid,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.updatedPost
      })
        .then(res => {
          axios({
            method: 'get',
            url: '/api/users/' + this.getCurrentUser,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })
            .then(res => {
              this.$store.commit('getViewedProfile', res.data)
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
  .currency {
    position: relative;
    width: 30%;
    left: 35%;
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
  .input-file {
    box-shadow: 1px 1px 2px #4d4d4d;
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
