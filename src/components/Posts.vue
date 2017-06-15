<template>
  <!-- This is where data should be retrieved from the DB and a v-for directive is used to iterate over the data -->
  <div class="row">
    <div class="col-sm-6 col-md-4" v-for="post in posts"> <!-- v-for on this element -->
      <div class="thumbnail">
        <img src="../assets/logo.png" alt="...">
        <div class="caption">
          <h3>Thumbnail Label #{{ post }}</h3>
          <h4>Price</h4>
          <p>Description goes here</p>
          <p><a href="#" class="btn btn-primary" role="button">View Post</a> <a href="#" class="btn btn-default" role="button">Contact Seller</a></p>
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
      posts: ['1', '2', '3', '4']
    }
  }
}
</script>

<style scoped>

</style>
