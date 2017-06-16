<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="col-sm-6 col-md-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <img :src="post.imgSrc" alt="...">
        <div class="caption">
          <h3>{{ post.title }}</h3>
          <h4>{{ post.price | currency }}</h4>
          <p>Description goes here</p>
          <!-- Hard-coded id for now -->
          <p><router-link to="/viewPost/1" class="btn btn-primary" role="button" @click="viewPost">View Post</router-link> <a href="#" class="btn btn-default" role="button">Contact Seller</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../main'
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
        {title: 'Free Thing',
          price: 0.00,
          imgSrc: 'http://s2.dmcdn.net/Ub1O8/1280x720-mCQ.jpg'
        },
        {title: 'Handmade Thing Grandma Made',
          price: 6.00,
          imgSrc: 'http://media.techeblog.com/images/fun_gadgets.jpg'
        }
      ]
    }
  },
  methods: {
    viewPost (post) {
      // TODO: Have this communicate post data to ViewPost.vue
      eventBus.$emit('viewPost', {
        data: {
          post: post
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
