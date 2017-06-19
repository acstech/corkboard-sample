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
                        type="text"
                        class="form-control"
                        placeholder="First name"
                        v-model="newUser.firstname"
                        required
                >
            </div>
            <div class="form-group">
                <input
                        type="text"
                        class="form-control"
                        placeholder="Last name"
                        v-model="newUser.lastname"
                        required
                >
            </div>
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
                        type="text"
                        class="form-control"
                        placeholder="Username"
                        v-model="newUser.username"
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
                        placeholder="confirm password"
                        v-model="newUser.confirm"
                        required
                >
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
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirm: '',
        siteId: '12341234-1234-1234-1234-432143214321'
      },
      error: ''
    }
  },
  methods: {
    register () {
      if (this.newUser.password !== this.newUser.confirm) {
        this.error = 'Your passwords do not match.'
        return
      }
      // TODO: Add validation steps and perhaps send to add user endpoint? (POST)
      axios({
        method: 'post',
        url: '/api/register',
        data: this.newUser
      })
      .then(res => {
        console.log(res)
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
