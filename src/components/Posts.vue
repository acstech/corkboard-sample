<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="grid container flex-center">
    <div class="grid-sizer"></div>
    <h1 v-if="allPosts.length == 0" class="flex-center">No posts yet! Create one!</h1>
    <div class="col-xs-4 grid-item" v-for="post in allPosts"> <!-- v-for on this element -->
      <div class="thumbnail" @click="viewPost({post})">
        <img v-if="post.url" :src="post.url" alt="Post Picture">
        <img v-else :src="$store.state.defaultPostImage" alt="..." style="margin-top:20px">
        <div class="caption">
          {{ post.name }}
          <h4><div class="Price" v-if="post.price != 0">{{ post.price | currency }}</div>
            <div class="Price" v-else>Free</div>
            <span class="glyphicon glyphicon-envelope" @click="contactSeller({post})" style="float:left; cursor:pointer"></span>
          </h4>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var glyphicon
import { Masonry, imagesLoaded } from '../main'
import axios from 'axios'
export default {
  computed: {
    allPosts () {
      return this.$store.state.allPosts
    }
  },
  mounted () {
    // Retrieve all items call to API
    axios({
      method: 'get',
      url: '/api/items',
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.token
      }
    })
      .then(res => {
        this.$store.commit('getAllPosts', res.data)
        var posts = document.querySelectorAll('.grid')
        imagesLoaded(posts, function () {
          // eslint-disable-next-line no-unused-vars
          var masonry = new Masonry('.grid', {
            selector: '.grid-item',
            columnWidth: 450,
            isFitWidth: true
          })
        })
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.$router.push('/login')
        }
      })
  },
  methods: {
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
  .thumbnail {
    box-shadow: 1px 1px 4px #4d4d4d;
    border: none;
    cursor: default;
    -webkit-transition: box-shadow .5s;
    transition: box-shadow .5s;
    margin-left: -3%;
    margin-right: -1%;
    margin-top: -2%;
  }
  .thumbnail:hover {
    box-shadow: 6px 6px 10px #383838;
  }
  .Price {
    float: right;
    color: maroon;
  }
  span.glyphicon {
    font-size: 1.1em;
    color: black;
  }
  .caption {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;      /* IE */
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
</style>
