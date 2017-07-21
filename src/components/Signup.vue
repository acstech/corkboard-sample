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
        <form @submit.prevent="register()" onsubmit="return passwordAccept()">
            <div class="md-form">
              <label>Email</label>
                <input
                        type="email"
                        class="form-control"
                        v-model="newUser.email"
                        required
                        maxlength="40"
                        autofocus="autofocus"
                        @focus="showText()"
                >
            </div>
            <div id="text" style="display:none"><p style="color:#656565">(We will not spam your email, this is strictly for contact between users)</p></div>
            <div class="md-form">
              <label>Password</label>
                <input
                        type="password"
                        class="form-control"
                        v-model="newUser.password"
                        @focus="showText2()"
                        required
                        maxlength=16
                >
            </div>
            <div id="text2" style="display:none"><p style="color:#656565">(Must be between 8-16 characters and contain one number and special character !@#$%^&*)</p></div>
            <div class="md-form">
              <label>Confirm Password</label>
                <input
                        type="password"
                        class="form-control"
                        v-model="newUser.confirm"
                        @focus="hideText()"
                        required
                        maxlength=16
                >
              <br>
              <div v-if="newUser.password == newUser.password && newUser.confirm == ''"></div>
              <div v-else-if="!passwordAccept" class="alert alert-danger">Passwords do not match... :(</div>
              <div v-else class="alert alert-success">Passwords match!</div>
            </div>
            <input type="submit" class="btn btn-mdb" value="Register">
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
    },
    // Only allows passwords to contain 6-16 characters,
    // at least one special character, and at least one number,
    // through regular expression
    passwordValidation () {
      var newPassword = this.newUser.password
      var minNumberofChars = 8
      var maxNumberofChars = 16
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
      if (newPassword.length < minNumberofChars || newPassword.length > maxNumberofChars) {
        alert('Your password must be between 8-16 characters and contain at least one number and one special character !@#$%^&*')
        return false
      }
      if (!regularExpression.test(newPassword)) {
        alert('Your password must be between 8-16 characters and contain at least one number and one special character !@#$%^&*')
        return false
      }
      return true
    }
  },
  methods: {
    showText () {
      var x = document.getElementById('text')
      var y = document.getElementById('text2')
      if (x.focus !== 'none') {
        x.style.display = 'block'
        y.style.display = 'none'
      }
    },
    showText2 () {
      var x = document.getElementById('text')
      var y = document.getElementById('text2')
      if (y.focus !== 'none') {
        y.style.display = 'block'
        x.style.display = 'none'
      }
    },
    hideText () {
      document.getElementById('text').style.display = 'none'
      document.getElementById('text2').style.display = 'none'
    },
    register () {
      if (!this.passwordAccept) {
        return
      }
      if (!this.passwordValidation) {
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
          this.error = 'The email you entered cannot be used.'
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
      box-shadow: 4px 4px 8px #4d4d4d;
      border-radius: 3px;
      margin-bottom: 20px;
    }
</style>
