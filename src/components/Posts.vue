<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="grid-sizer col-xs-4"></div>
    <h1 v-if="allPosts.length == 0" style="color:black">No posts yet! Create one!</h1>
    <div class="col-xs-4 grid-item" v-for="post in allPosts"> <!-- v-for on this element -->
      <div class="thumbnail" @click="viewPost({post})">
        <img v-if="shouldDisplayImage(post)" :src="post.url" alt="Post Picture" @click = "viewPost({post})">
        <img v-else :src="$store.state.defaultPostImage" alt="..." @click = "viewPost({post})">
        <span class="text-content" style="cursor:default"><span @click = "viewPost({post})">  Location </span></span>
        <div class="caption">
          {{ post.itemname }}
          <h4><div class="Price" v-if="post.itemprice != 0">{{ post.itemprice | currency }}</div>
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
    var posts = document.querySelectorAll('.grid-item')
    imagesLoaded(posts, function () {
      // eslint-disable-next-line no-unused-vars
      var masonry = new Masonry('.grid', {
        selector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      })
    })
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
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.$router.push('/login')
        }
      })
  },
  methods: {
    shouldDisplayImage (post) {
      return post.url && post.url.length > 0
    },
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
        var item = this.$store.state.activePost.itemname
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
        url: '/api/items/' + post.post.itemid,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })
      .then(res => {
        if (glyphicon !== true) {
          console.log(res)
          axios({
            method: 'get',
            url: '/api/users/' + post.post.userid,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })
            .then(res => {
              console.log(res)
              this.$store.commit('getActiveSeller', {user: res.data})
              this.$store.commit('getActiveEmail', {user: res.data})
            })
            .catch(error => {
              console.log(error)
            })
          this.$store.commit('getActivePost', {post: res.data})
          this.$router.push('/viewPost/' + post.post.itemid)
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
  .thumbnail {
    box-shadow: 2px 2px 8px #4d4d4d;
    border: none;
    cursor: default;
    -webkit-transition: box-shadow .5s;
    transition: box-shadow .5s;
    margin-left: -4%;
    margin-top: -1%;
  }
  .thumbnail:hover {
    box-shadow: 10px 10px 18px #383838;
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
  .text-content {
  background: rgba(0,0,0,0.8);
  color: white;
  cursor: pointer;
  display: table;
  height: 60px;
  left: 21px;
  position: absolute;
  width: 89%;
  top: 6px;
  opacity: 0;
  -webkit-transition: opacity 500ms;
  -moz-transition: opacity 500ms;
  -o-transition: opacity 500ms;
  transition: opacity 500ms;
  }
  span.text-content span {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  }
  span:hover {
    opacity: 1;
  }
  h1 {
    color: white;
  }
</style>
