<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Sign Up</h2>
        <p>Sign up now to buy and sell on Corkboard!</p>
        <p>Already have an account? Log in <router-link to="/login" style="font-weight:bold;color:#656565">here!</router-link>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <form @submit.prevent="register()">
            <div class="form-group">
                <input
                        type="email"
                        class="form-control"
                        placeholder="Email address"
                        v-model="newUser.email"
                        required
                >
            </div>
            <div class="form-group">
                <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        v-model="newUser.password"
                        required
                >
            </div>
            <div class="form-group">
                <input
                        type="password"
                        class="form-control"
                        placeholder="Confirm password"
                        v-model="newUser.confirm"
                        required
                >
              <br>
              <div v-if="newUser.password == '' && newUser.confirm == ''"></div>
              <div v-else-if="!passwordAccept" class="alert alert-danger">Passwords do not match... :(</div>
              <div v-else class="alert alert-success">Passwords match!</div>
            </div>
            <input type="submit" class="btn btn-primary" value="Register">
        </form>
    </div>
</template>

<script>
import { axios } from '../main'
export default {
  data () {
    return {
      newUser: {
        email: '',
        password: '',
        confirm: '',
        siteId: '12341234-1234-1234-1234-432143214321'
      },
      credentials: {
        email: '',
        password: '',
        siteId: '12341234-1234-1234-1234-432143214321'
      },
      error: ''
    }
  },
  computed: {
    passwordAccept () {
      return (this.newUser.password === this.newUser.confirm) && this.newUser.password.length > 0
    }
  },
  methods: {
    register () {
      if (!this.passwordAccept) {
        return
      }
      axios({
        method: 'post',
        url: '/api/users/register',
        data: this.newUser
      })
      .then(res => {
        console.log(res.data)
        this.$store.commit('getViewedProfile', this.newUser)
        this.credentials.email = this.newUser.email
        this.credentials.password = this.newUser.password
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
            this.$router.push('/editProfile/new')
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.error = 'Email is already registered.'
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
</style>
