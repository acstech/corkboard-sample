<template>
  <div class="col-sm-4 col-sm-offset-4">
    <div id="login_section">
      <h2>Login</h2>
      <p>Log in to buy and sell on Corkboard!</p>
      <p>Don't have an account? Make one
        <router-link to="/signup" style="font-weight:bold;color:#656565">here!</router-link>
      </p>
    </div>
    <div class="alert alert-danger" v-if="error">
      <p>{{ error }}</p>
    </div>
    <form @submit.prevent="logIn()">
      <div class="md-form">
        <label>Email</label>
        <input
          type="text"
          class="form-control"
          v-model="credentials.email"
          required
          maxlength="40"
          autofocus
        >
      </div>
      <div class="md-form">
        <label>Password</label>
        <input
          type="password"
          class="form-control"
          v-model="credentials.password"
          required
          maxlength="16"
        >
      </div>
      <br>
      <input type="submit" class="btn btn-mdb" value="Log In">
    </form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        credentials: {
          email: '',
          password: '',
          siteId: '12341234-1234-1234-1234-432143214321'
        },
        error: ''
      }
    },
    methods: {
      // Calls the Corkboard API to validate the user request to authenticate.
      logIn () {
        var email = this.credentials.email.toLowerCase()
        this.credentials.email = email
        axios({
          method: 'post',
          url: '/api/users/auth',
          data: this.credentials
        })
          .then(res => {
            this.$store.commit('authenticate', res.data.token)
            var base64Url = res.data.token.split('.')[1]
            var base64 = base64Url.replace('-', '+').replace('_', '/')
            this.$store.commit('getCurrentUser', JSON.parse(window.atob(base64)).uid)
            this.$router.push('/')
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.error = 'Username or password is incorrect. Please try again.'
            }
          })
      }
    }
  }
</script>

<style scoped>
  button {
    font-weight: bold;
  }

  #login_section {
    background-color: white;
    padding-top: 15px;
    padding-bottom: 15px;
    box-shadow: 4px 4px 8px #4d4d4d;
    border-radius: 3px;
    margin-bottom: 20px;
  }
</style>
