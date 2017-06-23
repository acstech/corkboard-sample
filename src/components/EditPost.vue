<template>
  <post-modal>
    <div class="modal-header">
      <h3>Edit Post</h3>
      <router-link class="close" to="/viewProfile/1">&times;</router-link>
    </div>

    <div class="modal-body">
      <form>
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
          <textarea rows="5" class="form-control" v-model="currentPost.itemdesc"></textarea>
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
        <label class="form-label">
          Sale Status:
          <input type="radio" v-model="salestatus" name="salestatus" value="Available"> Available
          <input type="radio" v-model="salestatus" name="salestatus" value="Sale Pending"> Sale Pending
        </label>
      </form>
    </div>

    <div class="modal-footer text-right">
      <router-link to="/viewProfile/1"><button class="btn btn-danger cancel">Cancel</button></router-link>
      <router-link to="/viewProfile/1"><button class="btn btn-primary">Save Changes</button></router-link>
    </div>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
import { Money } from 'v-money'
export default {
  computed: {
    currentPost () {
      return this.$store.state.activePost
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
</style>
