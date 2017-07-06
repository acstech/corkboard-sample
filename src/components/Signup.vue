<template>
    <div class="col-sm-4 col-sm-offset-4">
      <div id="signup_section">
        <h2>Sign Up</h2>
        <p>Sign up now to buy and sell on Corkboard!</p>
        <p>Already have an account? Log in <router-link to="/login" style="font-weight:bold;color:#656565">here!</router-link></p>
      </div>
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
                        maxlength="40"
                        autofocus="autofocus"
                        onfocus="this.select()"
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
            <input type="submit" class="btn btn-default" value="Register">
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
        url: '/api/users/register',
        data: this.newUser
      })
      .then(res => {
        this.$store.commit('getViewedProfile', this.newUser)
        this.$router.push('/login')
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
    #signup_section {
      background-color: white;
      padding-top: 15px;
      padding-bottom: 15px;
      box-shadow: 4px 4px 8px black;
      border-radius: 3px;
      margin-bottom: 20px;
    }
    input {
      box-shadow: 4px 4px 8px black;
      -webkit-transition: box-shadow .7s;
      transition: box-shadow .7s;
    }
    input:hover {
      box-shadow: none;
    }
</style>
