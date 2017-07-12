<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3>Edit Post</h3>
        <a class="close" @click="cancel()">&times;</a>
      </div>

      <form @submit.prevent="updatePost(currentPost)">
      <div class="modal-body">
          <label class="form-label">
            Pictures
            <input type="file" class="form-control" multiple>
          </label>
          <label class="form-label">
            Title
            <p style="font-size: 12px">(Max 50 Characters)</p>
            <input type="text" v-model="currentPost.itemname" class="form-control" maxlength="50">
          </label>
          <label class="form-label">
            Price
            <money v-model="currentPost.itemprice" v-bind="moneyConfig" class="form-control currency"></money>
          </label>
          <label class="form-label">
            Description
            <textarea rows="5" class="form-control" v-model="currentPost.itemdesc" maxlength="2000"></textarea>
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
            <input type="radio" v-model="salestatus" name="salestatus" value="Available" style="box-shadow:none"> Available
            <input type="radio" v-model="salestatus" name="salestatus" value="Sale Pending" style="box-shadow:none"> Sale Pending
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
      itemname: '',
      pictures: [],
      itemprice: 0.00,
      itemdesc: '',
      salestatus: '',
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
    if (this.getToken === null) {
      this.router.push('/login')
    }
  },
  methods: {
    updatePost (post) {
      axios({
        method: 'put',
        url: '/api/items/edit/' + this.currentPost.itemid,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: this.currentPost
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
