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
          <input type="text" class="form-control">
        </label>
        <label class="form-label">
          Price
          <money v-model="price" v-bind="moneyConfig" class="form-control currency"></money>
        </label>
        <label class="form-label">
          Description
          <textarea rows="5" class="form-control"></textarea>
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
      </form>
    </div>

    <div class="modal-footer text-right">
      <button class="btn btn-danger cancel">
        <router-link to="/viewProfile/1"><span>Cancel</span></router-link>
      </button>
      <button class="btn btn-primary">
        <router-link to="/viewProfile/1"><span>Save Changes</span></router-link>
      </button>
    </div>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
import { Money } from 'v-money'
export default {
  data () {
    return {
      title: '',
      pictures: [],
      price: 0.00,
      description: '',
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
</style>
