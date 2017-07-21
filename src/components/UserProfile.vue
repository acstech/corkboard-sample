<template>
  <div class="container-fluid" style="padding: 0 0 0 15px">
    <div class="row">
      <div class="col-md-2 col-sm-3 sidebar">
        <ul class="nav nav-sidebar">
          <h3 class="sub-header">User Profile</h3>
          <!-- Profile Picture -->
          <li>
            <div id="profile_pic_container" class="logo-wrapper waves-light flex-center">
              <a><img
                v-if="userProfile.url"
                @click="editProfile"
                :src="userProfile.url"
                class="profile-pic img-fluid flex-center"
                alt="Upload a profile picture!"
                style="cursor:pointer;margin-bottom:20px"/></a>
            </div>
          </li>
          <!-- /Profile Picture -->
          <li class="profile-info"><h4 class="profile-info-title">Name</h4>{{ userProfile.firstname
            }} {{ userProfile.lastname }}
          </li>
          <br>
          <li class="profile-info"><h4 class="profile-info-title">Email</h4>{{ userProfile.email }}</li>
          <br>
          <li class="profile-info"><h4 class="profile-info-title">Phone</h4>{{ userProfile.phone }}</li>
          <br>
          <li class="profile-info"><h4 class="profile-info-title">Zip</h4>{{ userProfile.zipcode }}</li>
        </ul>
        <a class="btn btn-mdb btn-sm" v-if="userProfile.id == getCurrentUser" @click="editProfile" id="edit_profile">
          <span style="color: white; margin-right: 10px;" class="glyphicon glyphicon-pencil"></span>Edit Profile
        </a>
      </div>
      <div class="grid col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <div class="grid-sizer"></div>
        <h1 class="flex-center" v-if="!this.userProfile.items || this.userProfile.items.length == 0">No posts yet!</h1>
        <div class="grid-item" v-for="post in this.userProfile.items"> <!-- v-for on this element -->
          <div class="thumbnail" @click="postPreview({post})">
            <!-- Show Primary image only -->
            <img v-if="shouldDisplayImage(post)" :src="post.url[0]" alt="...">
            <img v-else :src="$store.state.defaultPostImage" alt="..." style="margin-top:20px">
            <div class="caption">
              <h4>{{ post.name }}</h4>
              <h5 v-if="post.price != 0">{{ post.price | currency }}</h5>
              <h5 v-else>Free</h5>
              <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
              <p v-if="userProfile.id == getCurrentUser">
                <a><span @click="editPost({post})" class="glyphicon glyphicon-pencil"></span></a>
                <a><span @click.prevent="deletePost({post})" class="glyphicon glyphicon-trash"></span></a>
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
            columnWidth: 300,
            gutter: 20
          })
        })
      }
    },
    updated () {
      var posts = document.querySelectorAll('.grid')
      imagesLoaded(posts, function () {
        // eslint-disable-next-line no-unused-vars
        var masonry = new Masonry('.grid', {
          selector: '.grid-item',
          columnWidth: 300,
          gutter: 20
        })
      })
    },
    methods: {
      shouldDisplayImage (post) {
        return post.url && typeof post.url === typeof [] && post.url.length > 0
      },
      editPost (post) {
        glyphicon = true
        this.$store.commit('getActivePost', {post: post.post})
        this.$router.push('/editPost/' + post.post.id)
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
            url: '/api/items/delete/' + post.post.id,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            },
            data: post.post.id
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
              this.$router.push('/postPreview/' + post.post.id)
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
    background: -webkit-linear-gradient(bottom, #ffffff, #d1d5d5);
    background: -o-linear-gradient(top, #ffffff, #d1d5d5);
    background: -moz-linear-gradient(top, #ffffff, #d1d5d5);
    background: linear-gradient(to top, #ffffff, #d1d5d5);
    font-weight: bold;
    min-height: 400px;
    box-shadow: 1px 1px 3px #4d4d4d;
    padding: 0;
    position: fixed;
  }

  .btn {
    font-weight: bold;
  }

  .profile-pic {
    min-height: 150px;
    max-height: 200px;
    max-width: 100%;
  }

  #edit_profile {
    margin-bottom: 12px;
    margin-top: 20px;
  }

  .profile-info {
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* IE */
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

  .grid-item {
    width: 300px;
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
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* IE */
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
    color: rgb(80, 0, 0);
  }

  h1 {
    text-align: center;
    color: black;
  }

  @media (max-width: 700px) {
    .sidebar {
      background: -webkit-linear-gradient(bottom, #ffffff, #d1d5d5);
      background: -o-linear-gradient(top, #ffffff, #d1d5d5);
      background: -moz-linear-gradient(top, #ffffff, #d1d5d5);
      background: linear-gradient(to top, #ffffff, #d1d5d5);
      font-weight: bold;
      overflow: scroll;
      box-shadow: 1px 1px 3px #4d4d4d;
      padding-bottom: 1%;
    }

    .grid {
      width: 400px;
      float: right;
    }
  }

  /* For iPhone 5, etc. */
  @media (max-width: 568px) {
    .sidebar {
      background: -webkit-linear-gradient(bottom, #ffffff, #d1d5d5);
      background: -o-linear-gradient(top, #ffffff, #d1d5d5);
      background: -moz-linear-gradient(top, #ffffff, #d1d5d5);
      background: linear-gradient(to top, #ffffff, #d1d5d5);
      font-weight: bold;
      max-width: 180px;
      overflow: scroll;
      box-shadow: 1px 1px 3px #4d4d4d;
      padding-bottom: 1%;
    }

    .grid {
      width: 360px;
      float: right;
    }
  }
</style>
