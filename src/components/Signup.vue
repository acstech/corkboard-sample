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
                        placeholder="Confirm password"
                        v-model="newUser.confirm"
                        required
                >
            </div>
            <!--div class="form-group">
                <input
                       type="siteId"
                       class="form-control"
                       placeholder="Site ID"
                       v-model="newUser.siteId"
                
                >
            </div>
            <!-->
            <input type="submit" class="btn btn-primary" value="Register">
        </form>
    </div>
</template>

<script>
    import axios from 'axios'
    function generateUUID () {
      var d = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    }

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
            siteId: generateUUID()
          },
          error: ''
        }
      },
      methods: {
        register () {
          /* var registration = {
            // firstname: this.newUser.firstname,
            // lastname: this.newUser.lastname,
            email: this.newUser.email,
            // username: this.newUser.username,
            password: this.newUser.password,
            confirm: this.newUser.confirm,
            siteId: document.getElementById('uuid').innerHTML = generateUUID();
          }
          */
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
