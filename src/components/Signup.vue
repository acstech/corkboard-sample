<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Sign Up</h2>
        <p>Sign up now to buy and sell on the marketplace!</p>
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
              <div v-else-if="!passwordAccept" class="alert alert-danger">Passwords do not match</div>
              <div v-else class="alert alert-success">Passwords Match!</div>
            </div>
            <input type="submit" class="btn btn-primary" value="Register">
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      newUser: {
        email: '',
        password: '',
        confirm: '',
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
        url: '/api/register',
        data: this.newUser
      })
      .then(res => {
        console.log(res)
        this.$store.commit('authenticate')
        // TODO: Route to user profile for editing and adding more info after sign up
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
