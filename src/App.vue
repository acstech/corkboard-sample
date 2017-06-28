<template>
    <div id="app">
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <ul class="nav navbar-nav">
                  <router-link to="/"><div class="navbar-brand"><img src="../static/generatedtext.png"></div></router-link>
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/login" v-if="getToken == null">Login</router-link></li>
                    <li><router-link to="/signup" v-if="getToken == null">Sign Up</router-link></li>
                  <li class="dropdown" v-if="getToken != null">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Username<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                      <li><router-link to="/addpost">Add Post</router-link></li>
                      <li @click="viewSettings()"><router-link to="">Profile Settings</router-link></li>
                      <li role="separator" class="divider"></li>
                      <li @click="logOut()"><router-link to="">Logout</router-link></li>
                    </ul>
                  </li>
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
    logOut () {
      this.$store.commit('authenticate', null)
      this.$router.push('/login')
    },
    viewSettings () {
      // TODO: Axios call to get user by iD using this.getCurrentUser
      if (window.location.href.indexOf(this.getCurrentUser) > -1) {
        return
      } else {
        this.$router.push('viewProfile/' + this.getCurrentUser)
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
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .navbar {
      box-shadow: 1px 4px 5px grey;
      font-weight: bold;
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
        color: #0969b9;
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
