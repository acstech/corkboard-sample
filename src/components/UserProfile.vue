<template>
    <div class="row">
      <div class="col-sm-4 col-md-3 sidebar" style="display: inline">
        <ul class="nav nav-sidebar">
          <img src="../assets/jumpingCat.jpg" class="profile-pic">
          <h4 class="sub-header">User Profile</h4>
          <br>
          <router-link to="/editProfile/1" class="btn btn-info" role="button">Edit Profile</router-link>
          <br><br>
          <li class="profile-info">First Name:</li>
          <li class="profile-info">Last Name:</li>
          <li class="profile-info">Email:</li>
          <li class="profile-info">Anything Else:</li>
        </ul>
      </div>
      <div class="container">
      <div class="grid">
          <div class="grid-sizer col-xs-4"></div>
          <div class="col-xs-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
            <div class="thumbnail">
              <img :src="post.imgSrc" alt="...">
              <div class="caption">
                <h3>{{ post.title }}</h3>
                <h4>{{ post.price | currency }}</h4>
                <p>Description goes here</p>
                <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
                <p><router-link to="/editPost/1" class="btn btn-primary" role="button">Edit Post</router-link>
                  <router-link to="/" class="btn btn-danger" role="button">Delete Post</router-link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { Masonry } from '../main'
export default {
  data () {
    return {
      // Dummy data to make v-for display multiple thumbnails
      posts: [
        {title: 'Super Cool Item',
          price: 4.50,
          imgSrc: 'https://i.ytimg.com/vi/prALrHUJ8Ns/hqdefault.jpg'
        },
        {title: 'Stuff You Do Not Want',
          price: 10.00,
          imgSrc: 'http://unrealitymag.com/wp-content/uploads/2012/11/opener-465x465.jpg'
        },
        {title: 'Stuff You Do Not Want',
          price: 10.00,
          imgSrc: 'http://unrealitymag.com/wp-content/uploads/2012/11/opener-465x465.jpg'
        }
      ]
    }
  },
  mounted () {
    /* eslint-disable no-undef */
    var masonry = new Masonry('.grid', {
      selector: '.grid-item',
      columWidth: '.grid-sizer'
    })
    console.log(masonry)
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #0969b9;
  color: white;
  font-weight: bold;
  min-height: 800px;
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
</style>
