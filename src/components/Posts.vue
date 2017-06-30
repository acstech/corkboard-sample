<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="grid-sizer col-xs-4"></div>
    <h1 v-if="allPosts.length == 0">No posts yet! Create one!</h1>
    <div class="col-xs-4 grid-item" v-for="post in allPosts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <!--:src="post.imgSrc" --><img src="../assets/jumpingCat.jpg" alt="Post Picture" @click = "viewPost({post})" style="cursor:pointer">
        <span class="text-content"><span @click = "viewPost({post})">  Location </span></span>
        <div class="caption">
          {{ post.itemname }}
          <h4><div class="temp" v-if="post.itemprice != 0">{{ post.itemprice | currency }}</div>
            <div class="temp" v-else>Free</div>
            <a href="#"><span class="glyphicon glyphicon-envelope" style="float:left"></span></a>
          </h4>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        console.log(res.data)
        this.$store.commit('getAllPosts', res.data)
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.$router.push('/signup')
        }
      })
  },
  methods: {
    viewPost (post) {
      // Updates the state with the selected post's info
      this.$store.commit('getActivePost', {post: post.post})
      this.$router.push('/viewPost/' + post.post.itemid)
    }
  }
}
</script>

<style scoped>
  .thumbnail {
    box-shadow: 4px 4px 12px black;
    border: 2px solid #003458;
  }
  .temp {
    float: right;
    color: maroon;
  }
  img {
    box-shadow: 0 4px 6px grey;
  }
  span.glyphicon {
    font-size: 1.1em;
    color: black;
  }
  .caption {
    font-size: 18px;
    padding-top: 12px;
  }
  span.glyphicon:hover {
    color: lightgray;
  }
  span.glyphicon:hover:active {
    color: gray;
  }
  span.text-content {
  background: rgba(0,0,0,0.8);
  color: white;
  cursor: pointer;
  display: table;
  height: 60px;
  left: 21px;
  position: absolute;
  top: 6px;
  width: 348px;
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
