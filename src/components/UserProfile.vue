<template>
    <div class="row">
      <div class="col-sm-4 col-md-3 sidebar">
        <ul class="nav nav-sidebar">
          <h3 class="sub-header">User Profile</h3>
          <img src="../assets/jumpingCat.jpg" class="profile-pic">
            <!-- v-if="userProfile.id == getCurrentUser" -->
          <button class="btn btn-info" @click="editProfile" id="edit_profile">Edit Profile</button>
          <li class="profile-info"><h4>Name</h4>{{ userProfile.firstname }} {{ userProfile.lastname }}</li><br>
          <li class="profile-info"><h4>Email</h4>{{ userProfile.email }}</li><br>
          <li class="profile-info"><h4>Phone</h4>{{ userProfile.phone }}</li><br>
          <li class="profile-info"><h4>Zip</h4>{{ userProfile.zip }}</li>
        </ul>
      </div>
      <div class="container">
      <div class="grid col-md-offset-3 col-sm-offset-4">
          <div class="grid-sizer col-xs-4"></div>
          <div class="col-xs-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
            <div class="thumbnail">
              <!--:src="post.imgSrc" --><img src="../assets/jumpingCat.jpg" alt="...">
              <div class="caption">
                <h4>{{ post.itemname }}</h4>
                <h5 v-if="post.itemprice">{{ post.itemprice | currency }}</h5>
                <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
                <p>
                  <router-link to=""><span @click="editPost({post})" class="glyphicon glyphicon-pencil"></span></router-link>
                  <router-link to=""><span @click="deletePost({post})" class="glyphicon glyphicon-trash"></span></router-link>
               </p>
               <br>
              </div>
            </div>
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
    userProfile () {
      return this.$store.state.viewedUserProfile
    },
    getCurrentUser () {
      return this.$store.state.currentUser
    }
  },
  data () {
    return {
      posts: null
    }
  },
  mounted () {
    // eslint-disable-next-line no-unused-vars
    var posts = document.querySelectorAll('.grid-item')
    imagesLoaded(posts, function () {
      // eslint-disable-next-line no-unused-vars
      var masonry = new Masonry('.grid', {
        selector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      })
    })
    this.posts = this.userProfile.items
  },
  methods: {
    editPost (post) {
      this.$store.commit('getActivePost', {post: post.post})
      this.$router.push('/editPost/' + post.post.itemid)
    },
    editProfile () {
      this.$router.push('/editProfile/' + this.getCurrentUser)
    },
    deletePost (post) {
      if (confirm('Are you sure? This action cannot be undone!')) {
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
            console.log(res)
            axios({
              method: 'get',
              url: '/api/users/' + this.getCurrentUser,
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.token
              }
            })
              .then(res => {
                console.log(res)
                this.$store.commit('getViewedProfile', res.data)
              })
              .catch(error => {
                console.log(error)
              })
            this.$router.go('/viewProfile/' + this.userProfile.id)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.$router.push('/viewProfile/' + this.userProfile.id)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #003458;
  color: white;
  font-weight: bold;
  min-height: 800px;
  box-shadow: 4px 4px 6px grey;
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
    margin-top: 8px;
  }
  h4 {
    border-bottom: 2px solid white;
  }
  .thumbnail {
    box-shadow: 4px 4px 6px grey;
    border: 2px solid #003458;
  }
  span.glyphicon-pencil {
    color: black;
    font-size: 1.6em;
    float: left;
  }
  span.glyphicon-trash {
    color: black;
    font-size: 1.6em;
    float: right;
  }
  span.glyphicon-pencil:hover {
    color: lightgray;
  }
  span.glyphicon-trash:hover {
    color: maroon;
  }
  img {
    box-shadow: 0 4px 6px grey;
  }
</style>
