<template>
  <!-- Masonry Grid -->
  <div>
  <div class="grid container flex-center">
    <h1 v-if="allPosts.length == 0" class="flex-center">No posts yet! Create one!</h1>
    <!-- Represents each post as a masonry grid item -->
    <div class="col-xs-4 grid-item" v-for="post in allPosts">
      <div class="thumbnail" @click="viewPost({post})">
        <img v-if="post.url" :src="post.url" alt="Post Picture">
        <img v-else :src="$store.state.defaultPostImage" alt="..." style="margin-top:20px">
        <!-- Post Information (name, price) -->
        <div class="caption">
          {{ post.name }}
          <br>
          <span v-if="post.salestatus == 'Sale Pending'" class="badge red" style="box-shadow:none">{{ post.salestatus }}</span>
          <h4>
            <div class="price" v-if="post.price != 0">{{ post.price | currency }}</div>
            <div class="price" v-else>Free</div>
            <!-- Show contact icon or "Your Post" label depending on if it is the user's post -->
            <span v-if="post.userid !== getCurrentUser" class="glyphicon glyphicon-envelope" @click="contactSeller({post})" style="float:left; cursor:pointer"></span>
            <span v-else class="badge darkgray" style="float:left; box-shadow:none">Your post!</span>
          </h4>
        </div>
      </div>
    </div>
  </div>
  <div v-if="true" class="loading">
    <svg class="circular-loader">
      <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#67737f" stroke-width="2"/>
    </svg>
  </div>
</div>
</template>

<script>
  var _ = require('lodash')
  var glyphicon
  import { Masonry, imagesLoaded } from '../main'
  import axios from 'axios'

  export default {
    data () {
      return {
        masonryLoaded: false
      }
    },
    computed: {
      // Function that uses lodash to sort posts on the home page
      allPosts () {
        if (this.$store.state.sortValue === 'sortLow') {
          this.$store.state.sortValue = ''
          return _.sortBy(this.$store.state.allPosts, 'price')
        } else if (this.$store.state.sortValue === 'sortHigh') {
          this.$store.state.sortValue = ''
          return _.sortBy(this.$store.state.allPosts, 'price').reverse()
        } else {
          return _.sortBy(this.$store.state.allPosts, 'date').reverse()
        }
      },
      getCurrentUser () {
        return this.$store.state.currentUser
      }
    },
    mounted () {
      // Retrieve all items call to API
      var self = this
      axios({
        method: 'get',
        url: '/api/items',
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })
        .then(res => {
          this.$store.commit('getAllPosts', res.data)
          // Set up tile layout for the list of posts
          var posts = document.querySelectorAll('.grid')
          imagesLoaded(posts, function () {
            // eslint-disable-next-line no-unused-vars
            var masonry = new Masonry('.grid', {
              selector: '.grid-item',
              columnWidth: 450,
              isFitWidth: true
            })

            self.masonryLoaded = true

            masonry.on('layoutComplete', function (items) {
              debugger
              self.masonryLoaded = true
            })
          })
        })
        .catch(error => {
          if (error && error.response && error.response.status === 401) {
            this.$router.push('/login')
          }
        })
    },
    updated () {
      // Update the tile layout of posts in response to changes in post information
      var posts = document.querySelectorAll('.grid')
      imagesLoaded(posts, function () {
        // eslint-disable-next-line no-unused-vars
        var masonry = new Masonry('.grid', {
          selector: '.grid-item',
          columnWidth: 450,
          isFitWidth: true
        })
      })
    },
    methods: {
      // Function to open email application and contact seller
      contactSeller (post) {
        glyphicon = true
        axios({
          method: 'get',
          url: '/api/users/' + post.post.userid,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })
          .then(res => {
            this.$store.commit('getActivePost', {post: post.post})
            this.$store.commit('getActiveEmail', {user: res.data})
            var item = this.$store.state.activePost.name
            var email = this.$store.state.activeEmail
            var subject = 'I\'m interested in your ' + item + ' on CorkBoard!'
            window.location.href = 'mailto:' + email + '?subject=' + subject
          })
          .catch(error => {
            console.log(error)
          })
      },
      // Function that displays user information on post modal
      viewPost (post) {
        axios({
          method: 'get',
          url: '/api/items/' + post.post.id,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })
          .then(res => {
            if (glyphicon !== true) {
              // Grab the user information associated with the post to display to the user
              axios({
                method: 'get',
                url: '/api/users/' + post.post.userid,
                headers: {
                  'Authorization': 'Bearer ' + this.$store.state.token
                }
              })
                .then(res => {
                  this.$store.commit('getActiveSeller', {user: res.data})
                  this.$store.commit('getActiveEmail', {user: res.data})
                })
                .catch(error => {
                  console.log(error)
                })
              this.$store.commit('getActivePost', {post: res.data})
              this.$router.push('/viewPost/' + post.post.id)
            }
            glyphicon = false
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>
  .grid-item {
    width: 450px;
    margin: auto;
  }
  .loading {
    z-index: 999;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #f1f1f1;

  }
  .thumbnail {
    box-shadow: 1px 1px 4px #4d4d4d;
    border: none;
    cursor: default;
    -webkit-transition: box-shadow .5s;
    transition: box-shadow .5s;
    margin-left: -3%;
    margin-right: -1%;
    margin-top: -2%;
    padding-bottom: 18px;
  }

  img {
    max-height: 600px;
  }

  .thumbnail:hover {
    box-shadow: 6px 6px 10px #383838;
  }

  .price {
    float: right;
    color: maroon;
  }

  span.glyphicon {
    font-size: 1.1em;
    color: black;
  }

  .caption {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* IE */
    font-size: 18px;
    padding-top: 12px;
  }

  span.glyphicon:hover {
    color: lightgray;
  }

  span.glyphicon:hover:active {
    color: gray;
  }

  span:hover {
    opacity: 1;
  }

  h1 {
    text-align: center;
    color: black;
  }

  .center {
    margin: auto;
    max-width: 300px;
  }

  .circular-loader {
    -webkit-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
    height: 100px;
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
    width: 100px;
    margin-top: 50px;
  }

  .loader-path {
    stroke-dasharray: 150, 200;
    stroke-dashoffset: -10;
    -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round;
  }

  @-webkit-keyframes rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }

  @-webkit-keyframes color {
    0% {
      stroke: #67737f;
    }
    40% {
      stroke: #67737f;
    }
    66% {
      stroke: #67737f;
    }
    80%, 90% {
      stroke: #67737f;
    }
  }

  @keyframes color {
    0% {
      stroke: #67737f;
    }
    40% {
      stroke: #67737f;
    }
    66% {
      stroke: #67737f;
    }
    80%, 90% {
      stroke: #67737f;
    }
  }

</style>
