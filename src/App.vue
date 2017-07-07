<template>
    <div id="app">
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <ul class="nav navbar-nav">
                  <div class="navbar-brand" @click="toHome"><img src="../static/generatedtext.png"></div>
                  <li @click="toHome"><router-link to="">Home</router-link></li>
                    <li><router-link to="/login" v-if="getToken == null">Login</router-link></li>
                    <li><router-link to="/signup" v-if="getToken == null">Sign Up</router-link></li>
                    <li v-if="getToken != null"><router-link to="/addpost">Add Post</router-link></li>
                    <li v-if="getToken != null" @click="viewSettings()"><router-link to="">Profile Settings</router-link></li>
                    <li v-if="getToken != null" @click="logOut()"><router-link to="">Logout</router-link></li>
                </ul>
            </div>
        </nav>
        <div class="container" style="margin-top:80px">
            <router-view></router-view>
            <router-view name="modal"></router-view>
        </div>
    </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import AddPost from './components/AddPost.vue'
import axios from 'axios'

export default {
  name: 'app',
  computed: {
    getToken () {
      return this.$store.state.token
    },
    getCurrentUser () {
      return this.$store.state.currentUser
    }
  },
  methods: {
    toHome () {
      if (this.getToken === null) {
        this.$router.push('/login')
      } else {
        this.$router.push('/')
      }
    },
    logOut () {
      this.$store.commit('authenticate', null)
      this.$store.commit('getCurrentUser', null)
      this.$router.push('/login')
    },
    viewSettings () {
      // Axios call to get current user by iD using this.getCurrentUser
      if (this.$router.currentRoute.path === '/') {
        axios({
          method: 'get',
          url: '/api/users/' + this.getCurrentUser,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })
          .then(res => {
            console.log(res)
            this.$store.commit('getViewedProfile', res.data)
            this.$router.push('/viewProfile/' + this.getCurrentUser)
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  components: {
    products: ProductList,
    login: Login,
    signup: Signup,
    addPost: AddPost
  }
}
</script>

<style>
  body {
    background-color: #d3d5d1;
  }
  #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .navbar {
      box-shadow: 1px 4px 5px black;
      font-weight: bold;
      margin-bottom: 0;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
      color: #f7f4fd;
    }

    .navbar-brand {
      padding: 10px 10px 10px 36px;
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .5s ease;
    }

    .modal-container {
        width: 600px;
        max-height: 800px;
        overflow: scroll;
        margin: 50px auto 0;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .5s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #003458;
    }

    .modal-body {
        margin: 20px 0;
    }

    .text-right {
        text-align: right;
    }

    .form-label {
        display: block;
        margin-bottom: 1em;
    }

    .form-label > .form-control {
        margin-top: 0.5em;
    }

    .form-control {
        display: block;
        width: 100%;
        padding: 0.5em 1em;
        line-height: 1.5;
        border: 1px solid #ddd;
    }

    .modal-enter, .modal-leave {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
