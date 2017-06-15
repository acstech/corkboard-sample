<template>
    <div id="app">
        <nav class="navbar navbar-default">
            <div class="container">
                <ul class="nav navbar-nav">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/login"> <!--v-if="!user.authenticated"-->Login</router-link></li>
                    <li><router-link to="/signup"> <!--v-if="!user.authenticated"-->Sign Up</router-link></li>
                    <li><router-link to="/"> <!--v-if="user.authenticated" @click="logout()"-->Logout</router-link></li>
                    <li><router-link to="/addpost"> <!--v-if="user.authenticated"-->Add Post</router-link></li>
                </ul>
            </div>
        </nav>
        <div class="container">
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
  components: {
    products: ProductList,
    login: Login,
    signup: Signup,
    addPost: AddPost
  },
  data () {
    return {
      msg: 'Welcome to Your Marketplace App'
    }
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

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s ease;
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
        transition: all .3s ease;
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
