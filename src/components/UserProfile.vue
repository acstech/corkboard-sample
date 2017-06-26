<template>
    <div class="row">
      <div class="col-sm-4 col-md-3 sidebar">
        <ul class="nav nav-sidebar">
          <img src="../assets/jumpingCat.jpg" class="profile-pic">
          <h4 class="sub-header">User Profile</h4>
          <br>
          <!-- v-if user is authenticated && id matches profile id -->
          <router-link to="/editProfile/1" class="btn btn-info" role="button">Edit Profile</router-link>
          <br><br>
          <li class="profile-info">Name: {{ userProfile.firstname }} {{ userProfile.lastname }}</li>
          <li class="profile-info">Email: {{ userProfile.email }}</li>
          <li class="profile-info">Phone: {{ userProfile.phone }}</li>
          <li class="profile-info">Zip: {{ userProfile.zip }}</li>
        </ul>
      </div>
      <div class="container">
      <div class="grid col-md-offset-3 col-sm-offset-4">
          <div class="grid-sizer col-xs-4"></div>
          <div class="col-xs-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
            <div class="thumbnail">
              <img :src="post.imgSrc" alt="...">
              <div class="caption">
                <h3>{{ post.itemname }}</h3>
                <h4>{{ post.itemprice | currency }}</h4>
                <p>{{ post.itemdesc }}</p>
                <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
                <p><router-link to="/editPost/1"><span class="glyphicon glyphicon-pencil"></span></router-link>
                  <router-link to="/"><span class="glyphicon glyphicon-trash"></span></router-link></p>
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
    }
  },
  data () {
    return {
      // Dummy data to make v-for display multiple thumbnails
      // TODO: Query for all posts matching the user through an API call
      posts: [
        {itemname: 'Stuff You Do Not Want',
          itemprice: 10.00,
          itemdesc: 'You may not want this item but I hope that someone will.',
          imgSrc: 'http://unrealitymag.com/wp-content/uploads/2012/11/opener-465x465.jpg'
        },
        {itemname: 'Free Thing',
          itemprice: 0.00,
          itemdesc: 'Yes it is free, so please take it!',
          imgSrc: 'http://s2.dmcdn.net/Ub1O8/1280x720-mCQ.jpg'
        },
        {itemname: 'Handmade Thing Grandma Made',
          itemprice: 6.00,
          itemdesc: 'Yeah, so grandma is quite good at making things. She is also a lunatic.',
          imgSrc: 'http://media.techeblog.com/images/fun_gadgets.jpg'
        }
      ]
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
  },
  methods: {
    editPost (post) {
      // Updates the state with the selected post's info
      this.$store.commit('getActivePost', {post: post.post})
    },
    deletePost (post) {
      // TODO: Need user id somehow to route correctly!
      if (confirm('Are you sure? This action cannot be undone!')) {
        axios({
          method: 'delete',
          url: '/api/items/delete/' + post.post.itemid,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          },
          data: this.credentials
        })
          .then(res => {
            console.log(res)
            this.$router.push('/viewProfile/' + this.userProfile.id)
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
  background-color: #0969b9;
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
  .profile-info {
    margin-top: 8px;
    text-align: left;
  }
  .thumbnail {
    box-shadow: 4px 4px 6px grey;
    border: 2px solid #003458;
  }
  span.glyphicon {
    color: black;
    font-size: 2.0em;
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
