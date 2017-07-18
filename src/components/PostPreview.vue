<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h5 style="float:left; color:silver; margin-right:-70px">(Post preview)</h5>
        <h3 class="modal-title">{{ currentPost.itemname }}</h3>
        <a class="close" @click="cancel()">&times;</a>
      </div>

      <div class="modal-body">

        <div id="myCarousel" class="carousel slide" data-ride="carousel">
          <!-- Wrapper for slides -->
          <div class="carousel-inner">
            <div :class="{item: currentPost.url, active: index === 0}" v-for="(url, index) in currentPost.url">
              <img :src="url" alt="Picture" style="width:100%">
            </div>
          </div>

          <!-- Left and right controls -->
          <a class="left carousel-control" href="#myCarousel" data-slide="prev" v-if="currentPost.url.length > 1">
            <span class="glyphicon glyphicon-chevron-left"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" href="#myCarousel" data-slide="next" v-if="currentPost.url.length > 1">
            <span class="glyphicon glyphicon-chevron-right"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
        <div class="info">
          <h4>{{ currentPost.itemprice | currency }}</h4>
          <h4 class="seller">Being sold by {{ activeSeller }}</h4>
          <p>{{ currentPost.itemdesc }}</p>
        </div>
      </div>

    </post-modal>
  </transition>
</template>

<script>
// import axios from 'axios'
import PostModal from './PostModal.vue'
export default {
  computed: {
    currentPost () {
      return this.$store.state.activePost
    },
    activeSeller () {
      return this.$store.state.activeSeller
    },
    activeEmail () {
      return this.$store.state.activeEmail
    },
    getToken () {
      return this.$store.state.token
    }
  },
  beforeCreate () {
    if (this.getToken === null) {
      this.$router.push('/login')
    }
  },
  methods: {
    cancel () {
      this.$router.push('/viewProfile/' + this.getCurrentUser)
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
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;      /* IE */
  }
  .info {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;      /* IE */
  }
  span:hover {
    text-decoration: none;
    color: white;
  }
  span.glyphicon-envelope:hover {
    color: white;
  }
  .seller {
    border-bottom: 1px solid grey;
    padding-bottom: 4px;
  }
</style>
