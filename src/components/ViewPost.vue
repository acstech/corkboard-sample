<template>
  <transition name="modal">
    <div class="modal-mask" id="mask" @click="close" v-show="show" transition="modal">
      <div class="modal-container" @click.stop :show.sync="show" :on-close="close">
        <div class="modal-header">
          <h3 class="modal-title">{{ currentPost.name }}</h3>
          <router-link class="close" to="/">&times;</router-link>
        </div>

        <div class="modal-body">
          <!-- Carousel pictures of items-->
          <carousel :perPage=1>
              <slide :class="{item: currentPost.url, active: index == 0}" v-for="(url, index) in currentPost.url">
                <img :src="url" alt="Picture" style="width:100%;">
              </slide>
          </carousel>
          <!-- Post information -->
          <div class="info">
            <h4>{{ currentPost.price | currency }}</h4>
            <h4 class="seller">Being sold by {{ activeSeller }}</h4>
            <p>{{ currentPost.description }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <p align="center">
          <span class="btn btn-lg btn-mdb" style="margin-top:20px" @click="contactSeller()">
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
