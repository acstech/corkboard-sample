<template>
  <post-modal>
    <div class="modal-header">
      <h3>{{ currentPost.title }}</h3>
      <router-link class="close" to="/">&times;</router-link>
    </div>

    <div class="modal-body">

      <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
          <li data-target="#myCarousel" data-slide-to="2"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner">
          <div class="item active">
            <img src="../assets/jumpingCat.jpg" alt="Picture 1" style="width:100%">
          </div>

          <div class="item">
            <img src="../assets/jumpingCat.jpg" alt="Picture 2" style="width:100%">
          </div>

          <div class="item">
            <img src="../assets/jumpingCat.jpg" alt="Picture 3" style="width:100%">
          </div>
        </div>

        <!-- Left and right controls -->
        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>

      <h4>{{ currentPost.price | currency }}</h4>
      <h4>Seller: Seller Name</h4>
      <p>{{ currentPost.description }}</p>

    </div>

    <div class="modal-footer text-right">
      <router-link to="/"><button class="btn btn-danger cancel">
        <span>Cancel</span>
      </button></router-link>
      <router-link to="/"><button class="btn btn-primary">
        <span>Contact Seller</span>
      </button></router-link>
    </div>
  </post-modal>
</template>

<script>
import PostModal from './PostModal.vue'
export default {
  computed: {
    currentPost () {
      return this.$store.state.activePost
    }
  },
  components: {
    postModal: PostModal
  }
}
</script>

<style scoped>
  h3 {
    display: inline;
  }
  .cancel {
    float: left;
  }
  span:hover {
    text-decoration: none;
    color: white;
  }
</style>
