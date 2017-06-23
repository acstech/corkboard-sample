<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="grid-sizer col-xs-4"></div>
    <h1 v-if="posts == null">No posts yet! Create one!</h1>
    <div class="col-xs-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <router-link to="/viewPost/1">
          <img :src="post.imgSrc" alt="..." @click="viewPost({post})">
        </router-link>
        <div class="caption">
          <h3>{{ post.itemname }}</h3>
          <h4>{{ post.itemprice | currency }}</h4>
          <p>{{ post.itemdesc }}</p>
          <!-- Hard-coded id for now -->
          <p>
            <router-link to="/viewPost/1"><button class="btn btn-primary" @click="viewPost({post})">View Post</button></router-link>
            <a href="#" class="btn btn-default" role="button">Contact Seller</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Masonry, imagesLoaded, axios } from '../main'
export default {
  data () {
    return {
      // Dummy data to make v-for display multiple thumbnails. This would be grabbed from a DB
      posts: null
      /* posts: [
        {itemname: 'Super Cool Item',
          itemprice: 4.50,
          itemdesc: 'This item is so dang cool that you must want to buy it now!',
          imgSrc: 'https://i.ytimg.com/vi/prALrHUJ8Ns/hqdefault.jpg',
          salestatus: 'Available'
        },
        {itemname: 'Stuff You Do Not Want',
          itemprice: 10.00,
          itemdesc: 'You may not want this item but I hope that someone will.',
          imgSrc: 'http://unrealitymag.com/wp-content/uploads/2012/11/opener-465x465.jpg',
          salestatus: 'Available'
        },
        {itemname: 'Doge',
          itemprice: 1000000,
          itemdesc: 'I just can\'t even...',
          imgSrc: 'https://secure.static.tumblr.com/8789fbc80d23f8ffafc45a99797d9bdd/gb7zeki/Fqcnxkn7u/tumblr_static_tumblr_static_filename_640.jpg',
          salestatus: 'Available'
        },
        {itemname: 'Free Thing',
          itemprice: 0.00,
          itemdesc: 'Yes it is free, so please take it!',
          imgSrc: 'http://s2.dmcdn.net/Ub1O8/1280x720-mCQ.jpg',
          salestatus: 'Available'
        },
        {itemname: 'Handmade Thing Grandma Made',
          itemprice: 6.00,
          itemdesc: 'Yeah, so grandma is quite good at making things. She is also a lunatic.',
          imgSrc: 'http://media.techeblog.com/images/fun_gadgets.jpg',
          salestatus: 'Available'
        },
        {itemname: 'Random Stuff',
          itemprice: 35.00,
          itemdesc: 'This is completely random but take it anyway, it is all good stuff.',
          imgSrc: 'http://images.designntrend.com/data/images/full/50404/top-5-gadgets-list-image-jpg.jpg?w=780',
          salestatus: 'Available'
        },
        {
          itemname: 'Random Stuff Again',
          itemprice: 35.00,
          itemdesc: 'Oh look, more random stuff!',
          imgSrc: 'https://www.techprevue.com/wp-content/uploads/2016/03/tech-items-1024x682.jpg',
          salestatus: 'Available'
        }
      ] */
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
    // Retrieve all items call to API
    axios({
      method: 'get',
      url: '/api/items',
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.token
      }
    })
      .then(res => {
        console.log(res)
        this.posts = res.data
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
    }
  }
}
</script>

<style scoped>
  .thumbnail {
    box-shadow: 4px 4px 6px grey;
    border: 2px solid #003458;
  }
  img {
    box-shadow: 0 4px 6px grey;
  }
</style>
