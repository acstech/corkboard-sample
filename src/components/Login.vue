<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Log In</h2>
        <p>Log in to your account to buy and sell on the marketplace!</p>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <form>
            <div class="form-group">
                <input
                        type="text"
                        class="form-control"
                        placeholder="Enter your username"
                        v-model="credentials.username"
                >
            </div>
            <div class="form-group">
                <input
                        type="password"
                        class="form-control"
                        placeholder="Enter your password"
                        v-model="credentials.password"
                >
            </div>
            <input type="submit" class="btn btn-primary" @submit.prevent="logIn()" value="Log In">
        </form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      credentials: {
        username: '',
        password: ''
        siteId: '12341234-1234-1234-1234-123412341234'
      },
      error: ''
    }
  },
  methods: {
    logIn () {
      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      console.log(credentials)
      // TODO: Add authentication steps
      axios({
        method: 'post',
        url: '/api/authenticate',
        data: this.credentials
      })
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error)
    }
  }
}
</script>

<style scoped>
    button {
        font-weight: bold;
    }
</style>
