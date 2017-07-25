<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" @click="close" v-show="show" transition="modal">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">

        <router-link class="close" to="/">&times;</router-link>

        <div class="modal-header">
          <h3 class="modal-title">{{ currentPost.name }}</h3>
        </div>

        <div class="modal-body">
          <!-- Carousel pictures of items using vue-carousel -->
          <carousel :perPage=1 :autoplay=true :autoplayTimeout=5000 :autoplayHoverPause=true :navigationEnabled="(currentPost.url.length > 1)" :loop=true>
            <slide :class="{item: currentPost.url, active: index == 0}" v-for="(url, index) in currentPost.url">
              <img :src="url" alt="Picture" style="max-width: 100%">
            </slide>
          </carousel>
          <!-- Post information -->
          <div class="info">
            <h4 v-if="currentPost.price != 0">{{ currentPost.price | currency }}</h4>
            <h4 v-else>Free</h4>
            <h4 class="seller">Being sold by <a @click="viewProfile">{{ activeSeller }}</a></h4>
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
        <!-- Displays if the user is viewing a post they made -->
        <div class="modal-footer" v-else>
          <p align=center>
            <span class="badge darkgray center" style="box-shadow:none">
            This is your post
            </span>
          </p>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
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
      getCurrentUser () {
        return this.$store.state.currentUser
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
    mounted () {
      // Allows modal close when pressing the ESC key
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.$router.push('/')
        }
      })
    },
    methods: {
      // Closes the modal if its background is clicked
      close () {
        this.$router.push('/')
        this.show = false
      },
      // Allows the user to view the seller's profile and list of posts
      viewProfile () {
        axios({
          method: 'get',
          url: '/api/users/' + this.currentPost.userid,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })
          .then(res => {
            this.$store.commit('getViewedProfile', res.data)
            this.$router.push('/viewProfile/' + this.currentPost.userid)
          })
          .catch(error => {
            // Token expiry (401). Route user to the login page
            if (error.response.status === 401) {
              this.$store.commit('authenticate', null)
              let vm = this
              setTimeout(function () {
                vm.$router.push('/login')
              }, 100)
            }
          })
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
