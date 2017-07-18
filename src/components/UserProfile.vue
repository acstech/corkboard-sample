<template>
    <div class="row">
      <div class="col-sm-4 col-md-3 sidebar">
        <ul class="nav nav-sidebar">
          <h3 class="sub-header" style="padding-bottom:20px">User Profile</h3>
          <img
            v-if="userProfile.url"
            @click="editProfile"
            :src="userProfile.url"
            class="profile-pic"
            alt="Upload a profile picture!"
            style="cursor:pointer;margin-bottom:20px"/>
          <li class="profile-info"><h4 class="profile-info-title">Name</h4>{{ userProfile.firstname }} {{ userProfile.lastname }}</li><br>
          <li class="profile-info"><h4 class="profile-info-title">Email</h4>{{ userProfile.email }}</li><br>
          <li class="profile-info"><h4 class="profile-info-title">Phone</h4>{{ userProfile.phone }}</li><br>
          <li class="profile-info"><h4 class="profile-info-title">Zip</h4>{{ userProfile.zipcode }}</li>
        </ul>
        <span
          v-if="userProfile.id == getCurrentUser"
          @click="editProfile"
          id="edit_profile"
          class="glyphicon glyphicon-pencil"
          style="cursor:pointer; margin-left:1%; margin-top:40%">
        </span>
      </div>
      <div class="container">
      <div class="grid col-md-offset-3 col-sm-offset-4">
          <div class="grid-sizer col-xs-4"></div>
        <h1 v-if="!this.userProfile.items || this.userProfile.items.length == 0" style="color:black">No posts yet!</h1>
          <div class="col-xs-4 grid-item" v-for="post in this.userProfile.items"> <!-- v-for on this element -->
            <div class="thumbnail" @click="postPreview({post})">
              <!-- Show Primary image only -->
              <img v-if="shouldDisplayImage(post)" :src="post.url[0]" alt="...">
              <img v-else :src= "$store.state.defaultPostImage" alt="..." style="margin-top:20px">
              <div class="caption">
                <h4>{{ post.itemname }}</h4>
                <h5 v-if="post.itemprice != 0">{{ post.itemprice | currency }}</h5>
                <h5 v-else>Free</h5>
                <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
                <p v-if="userProfile.id == getCurrentUser">
                  <router-link to=""><span @click="editPost({post})" class="glyphicon glyphicon-pencil"></span></router-link>
                  <router-link to=""><span @click.prevent="deletePost({post})" class="glyphicon glyphicon-trash"></span></router-link>
                </p>
              </div>
            </div>
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
    userProfile () {
      return this.$store.state.viewedUserProfile
    },
    getCurrentUser () {
      return this.$store.state.currentUser
    },
    getToken () {
      return this.$store.state.token
    }
  },
  mounted () {
    if (this.getToken === null) {
      this.$router.push('/login')
    } else {
      // Set up masonry layout for the user's posts
      var posts = document.querySelectorAll('.grid')
      imagesLoaded(posts, function () {
        // eslint-disable-next-line no-unused-vars
        var masonry = new Masonry('.grid', {
          selector: '.grid-item',
          columnWidth: '.grid-sizer',
          percentPosition: true
        })
      })
    }
  },
  methods: {
    shouldDisplayImage (post) {
      return post.url && typeof post.url === typeof [] && post.url.length > 0
    },
    editPost (post) {
      glyphicon = true
      this.$store.commit('getActivePost', {post: post.post})
      this.$router.push('/editPost/' + post.post.itemid)
    },
    editProfile () {
      if (this.userProfile.id !== this.getCurrentUser) {
        return
      }
      this.$router.push('/editProfile/' + this.getCurrentUser)
    },
    deletePost (post) {
      glyphicon = true
      // Make sure user is sure to continue with deletion
      if (confirm('Are you sure? This action cannot be undone!')) {
        // AXIOS: DELETE item call
        axios({
          method: 'delete',
          url: '/api/items/delete/' + post.post.itemid,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          },
          data: post.post.itemid
        })
          // Retrieve updated user profile page
          .then(res => {
            // AXIOS: GET user call
            axios({
              method: 'get',
              url: '/api/users/' + this.getCurrentUser,
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.token
              }
            })
              .then(res => {
                this.$store.commit('getViewedProfile', res.data)
                // Refresh grid layout to account for deleted post
                var posts = document.querySelectorAll('.grid-item')
                imagesLoaded(posts, function () {
                  // eslint-disable-next-line no-unused-vars
                  var masonry = new Masonry('.grid', {
                    selector: '.grid-item',
                    columnWidth: '.grid-sizer',
                    percentPosition: true
                  })
                })
              })
              .catch(error => {
                console.log(error)
              })
            this.$router.push('/viewProfile/' + this.userProfile.id)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        // Take user back to profile if they decide to cancel delete request
        this.$router.push('/viewProfile/' + this.userProfile.id)
      }
    },
    postPreview (post) {
      axios({
        method: 'get',
        url: '/api/items/' + post.post.itemid,
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
          this.$router.push('/postPreview/' + post.post.itemid)
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
.sidebar {
  background: -webkit-linear-gradient(bottom, #efe3e7, #ffffff);
  background: -o-linear-gradient(top, #efe3e7, #ffffff);
  background: -moz-linear-gradient(top, #efe3e7, #ffffff);
  background: linear-gradient(to top, #efe3e7, #ffffff);
  font-weight: bold;
  min-height: 400px;
  box-shadow: 1px 1px 3px #4d4d4d;
  }
  .btn {
  font-weight: bold;
  }

  .profile-pic {
    border: solid white 2px;
    margin-top: 10px;
    width: 50%;
    height: 50%;
    max-height: 200px;
    max-width: 200px;
    min-height: 150px;
    min-width: 150px;
  }
  #edit_profile {
    display: block;
    /* Not a good way to center, not responsive */
    margin: 5% 0 5% 31%;
  }
  .profile-info {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;      /* IE */
    margin-top: 8px;
  }
  .profile-info-title {
    border-bottom: 2px solid #262626;
  }
  h3 {
    color: #262626;
  }
  li {
    color: #262626;
  }
  .thumbnail {
    box-shadow: 1px 1px 3px #4d4d4d;
    padding-bottom: 15px;
    cursor: default;
    -webkit-transition: box-shadow .5s;
    transition: box-shadow .5s;
  }
  .thumbnail:hover {
    box-shadow: 5px 5px 8px #383838;
  }
  .caption {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;      /* IE */
  }
  span.glyphicon-pencil {
    color: black;
    font-size: 1.2em;
    float: left;
  }
  span.glyphicon-trash {
    color: black;
    font-size: 1.2em;
    float: right;
  }
  span.glyphicon-pencil:hover {
    color: lightgray;
  }
  span.glyphicon-pencil:hover:active {
    color: gray;
  }
  span.glyphicon-trash:hover {
    color: maroon;
  }
  span.glyphicon-trash:hover:active {
    color: rgb(80,0,0);
  }
</style>
