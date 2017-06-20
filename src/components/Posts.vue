<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="grid-sizer col-xs-4"></div>
    <div class="col-xs-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <router-link to="/viewPost/1"><img :src="post.imgSrc" alt="..."></router-link>
        <div class="caption">
          <h3>{{ post.title }}</h3>
          <h4>{{ post.price | currency }}</h4>
          <p>{{ post.description }}</p>
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
import { Masonry } from '../main'
export default {
  data () {
    return {
      // Dummy data to make v-for display multiple thumbnails. This would be grabbed from a DB
      posts: [
        {title: 'Super Cool Item',
          price: 4.50,
          description: 'This item is so dang cool that you must want to buy it now!',
          imgSrc: 'https://i.ytimg.com/vi/prALrHUJ8Ns/hqdefault.jpg'
        },
        {title: 'Stuff You Do Not Want',
          price: 10.00,
          description: 'You may not want this item but I hope that someone will.',
          imgSrc: 'http://unrealitymag.com/wp-content/uploads/2012/11/opener-465x465.jpg'
        },
        {title: 'Free Thing',
          price: 0.00,
          description: 'Yes it is free, so please take it!',
          imgSrc: 'http://s2.dmcdn.net/Ub1O8/1280x720-mCQ.jpg'
        },
        {title: 'Handmade Thing Grandma Made',
          price: 6.00,
          description: 'Yeah, so grandma is quite good at making things. She is also a lunatic.',
          imgSrc: 'http://media.techeblog.com/images/fun_gadgets.jpg'
        },
        {title: 'Random Stuff',
          price: 35.00,
          description: 'This is completely random but take it anyway, it is all good stuff.',
          imgSrc: 'http://images.designntrend.com/data/images/full/50404/top-5-gadgets-list-image-jpg.jpg?w=780'
        },
        {title: 'Random Stuff Again',
          price: 35.00,
          description: 'Oh look, more random stuff!',
          imgSrc: 'https://www.techprevue.com/wp-content/uploads/2016/03/tech-items-1024x682.jpg'
        }
      ]
    }
  },
  mounted () {
    // eslint-disable-next-line no-unused-vars
    var masonry = new Masonry('.grid', {
      selector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true
    })
  },
  methods: {
    viewPost (post) {
      this.$store.commit('getActivePost', {post: post.post})
    }
  }
}
</script>

<style scoped>
</style>
