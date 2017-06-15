<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row grid">
    <div class="col-sm-6 col-md-4 grid-item" v-for="post in posts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <img src="../assets/logo.png" alt="...">
        <div class="caption">
          <h3>{{ post.title }}</h3>
          <h4>{{ post.price | currency }}</h4>
          <p>Description goes here</p>
          <!-- Hard-coded id for now -->
          <p><router-link to="/viewPost/1" class="btn btn-primary" role="button">View Post</router-link> <a href="#" class="btn btn-default" role="button">Contact Seller</a></p>
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
          price: 4.50
        },
        {title: 'Stuff You Do Not Want',
          price: 10.00
        },
        {title: 'Free Thing',
          price: 0.00
        },
        {title: 'Handmade Thing Grandma Made',
          price: 6.00
        }
      ]
    }
  },
  mounted () {
    var elem = document.querySelector('.grid')

    /* eslint-disable no-undef */
    var msnry = new Masonry(elem, {
      // options
      itemSelector: '.grid-item',
      columnWidth: 200
    })

    console.log(msnry)
  }
}
</script>

<style scoped>

</style>
