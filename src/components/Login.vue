<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Login</h2>
        <p>Log in to your account to buy and sell on Corkboard!</p>
        <p>Don't have an account? Make one <router-link to="/signup" style="font-weight:bold;color:#656565">here!</router-link>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <form @submit.prevent="logIn()">
            <div class="form-group">
                <input
                        type="text"
                        class="form-control"
                        placeholder="Enter your email"
                        v-model="credentials.email"
                        required
                >
            </div>
            <div class="form-group">
                <input
                        type="password"
                        class="form-control"
                        placeholder="Enter your password"
                        v-model="credentials.password"
                        required
                >
            </div>
            <input type="submit" class="btn btn-primary" value="Log In">
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
    logIn () {
      axios({
        method: 'post',
        url: '/api/users/auth',
        data: this.credentials
      })
      .then(res => {
        console.log(res)
        this.$store.commit('authenticate')
        this.$router.push('/')
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
    button {
        font-weight: bold;
    }
</style>
