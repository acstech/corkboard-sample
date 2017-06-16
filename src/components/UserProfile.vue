<template>
    <div class="row">
      <div class="col-sm-4 col-md-3 sidebar" style="display: inline">
        <ul class="nav nav-sidebar">
          <img src="../assets/logo.png">
          <h4 class="sub-header">User Profile</h4>
          <br>
          <router-link to="/" class="btn btn-info" role="button">Edit Profile</router-link>
          <br><br>
          <li>Information Here</li>
          <br>
        </ul>
      </div>
      <div class="">
          <div class="col-sm-6 col-md-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
            <div class="thumbnail">
              <img :src="post.imgSrc" alt="...">
              <div class="caption">
                <h3>{{ post.title }}</h3>
                <h4>{{ post.price | currency }}</h4>
                <p>Description goes here</p>
                <!-- Use v-if directives depending on if user is logged in, if it's their profile, etc. -->
                <p><router-link to="/" class="btn btn-primary" role="button">Edit Post</router-link></p>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
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
        }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #0969b9;
  color: white;
  font-weight: bold;
}
.btn {
  font-weight: bold;
}
</style>
