<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" transition="modal" @click="close" v-show="show">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">

        <h5 style="float:left; color:silver; margin-right:-70px;" v-if="currentPost.userid == getCurrentUser">(Post preview)</h5>
        <a class="close" @click="cancel()">&times;</a>

        <div class="modal-header">
          <h3 class="modal-title">{{ currentPost.name }}</h3>
        </div>

        <div class="modal-body">
          <!-- Carousel pictures of items using vue-carousel -->
          <carousel :perPage=1 :autoplay=true :autoplayTimeout=5000 :autoplayHoverPause=true :navigationEnabled="(currentPost.url.length > 1)" :loop=true>
            <slide :class="{item: currentPost.url, active: index == 0}" v-for="(url, index) in currentPost.url" :key="url">
              <img :src="url" alt="Picture" style="max-width: 100%">
            </slide>
          </carousel>

          <div class="info">
            <h4 v-if="currentPost.price != 0">{{ currentPost.price | currency }}</h4>
            <h4 v-else>Free</h4>
            <h4 class="seller">Being sold by {{ activeSeller }}</h4>
            <h5>Category: {{ currentPost.category }}</h5>
            <p>{{ currentPost.description }}</p>
          </div>
        </div>

        <p align="center" v-if="currentPost.salestatus == 'Sale Pending'"><span class="badge red">{{ currentPost.salestatus }}</span></p>

        <!-- Display contact option if the user is viewing someone else's post -->
        <div class="modal-footer" v-if="currentPost.userid !== getCurrentUser">
          <p align="center">
          <span class="btn btn-md btn-mdb" style="margin-top:20px" @click="contactSeller()">
            <span class="glyphicon glyphicon-envelope"></span> Contact
          </span>
          </p>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        // A check for whether the modal should be shown
        show: true
      }
    },
    computed: {
      currentPost () {
        return this.$store.state.activePost
      },
      activeSeller () {
        return this.$store.state.activeSeller
      },
      getCurrentUser () {
        return this.$store.state.currentUser
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
    mounted () {
      // Allows modal close when pressing the ESC key
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.$router.push('/viewProfile/' + this.currentPost.userid)
        }
      })
    },
    methods: {
      // Closes the modal if its background is clicked
      close () {
        this.$router.push('/viewProfile/' + this.currentPost.userid)
        this.show = false
      },
      cancel () {
        this.$router.push('/viewProfile/' + this.currentPost.userid)
      },
      // For now, the contact seller method uses the default mailto functionality to allow the user
      // to send them an email about the specific item they are viewing.
      contactSeller () {
        var item = this.$store.state.activePost.name
        var email = this.$store.state.activeEmail
        var subject = 'I\'m interested in your ' + item + ' on CorkBoard!'
        window.location.href = 'mailto:' + email + '?subject=' + subject
      }
    }
  }
</script>

<style scoped>
  h3 {
    display: inline;
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* IE */
  }

  img {
    max-height: 600px;
  }

  .info {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* IE */
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
