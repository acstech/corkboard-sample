<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="grid-sizer col-xs-4"></div>
    <h1 v-if="allPosts.length == 0" style="color:black">No posts yet! Create one!</h1>
    <div class="col-xs-4 grid-item" v-for="post in allPosts"> <!-- v-for on this element -->
      <div class="thumbnail" @click="viewPost({post})">
        <!--:src="post.imgSrc" --><img src="../assets/catwill.jpg" alt="Post Picture" @click = "viewPost({post})">
        <span class="text-content" style="cursor:default"><span @click = "viewPost({post})">  Location </span></span>
        <div class="caption">
          {{ post.itemname }}
          <h4><div class="Price" v-if="post.itemprice != 0">{{ post.itemprice | currency }}</div>
            <div class="Price" v-else>Free</div>
            <span class="glyphicon glyphicon-envelope" @click="contactSeller()" style="float:left; cursor:pointer"></span>
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
    contactSeller () {
      glyphicon = true
      var email = this.$store.state.activeSeller
      var subject = 'I\'m interested in your CorkBoard item!'
      window.location.href = 'mailto:' + email + '?subject=' + subject
    },
    viewPost (post) {
      axios({
        method: 'get',
        url: '/api/users/' + post.post.userid,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })
      .then(res => {
        if (glyphicon !== true) {
          this.$store.commit('getActivePost', {post: post.post})
          this.$store.commit('getActiveSeller', {user: res.data})
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
    box-shadow: 4px 4px 12px #4d4d4d;
    border: 2px solid #003458;
    cursor: default;
    -webkit-transition: box-shadow .5s;
    transition: box-shadow .5s;
  }
  .thumbnail:hover {
    box-shadow: 10px 10px 18px #4d4d4d;
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
