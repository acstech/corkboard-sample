<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <h3 class="modal-title">{{ currentPost.itemname }}</h3>
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
              <img :src="currentPost.url" alt="Picture 1" style="width:100%">
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
        <div class="info">
          <h4>{{ currentPost.itemprice | currency }}</h4>
          <h4 class="seller">Being sold by {{ activeSeller }}</h4>
          <p>{{ currentPost.itemdesc }}</p>
        </div>
      </div>

      <div class="modal-footer">
        <p align="center">
          <span class="btn btn-lg btn-default" style="margin-top:20px" @click="contactSeller()">
            <span class="glyphicon glyphicon-envelope"></span> Contact
          </span>
        </p>
      </div>
    </post-modal>
  </transition>
</template>

<script>

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
    contactSeller () {
      var item = this.$store.state.activePost.itemname
      var email = this.$store.state.activeEmail
      var subject = 'I\'m interested in your ' + item + ' on CorkBoard!'
      window.location.href = 'mailto:' + email + '?subject=' + subject
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
