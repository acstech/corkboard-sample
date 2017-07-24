<template>
  <div id="app">
    <nav class="navbar navbar-default navbar-fixed-top">
      <div>
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" @click="toHome" style="cursor:pointer"><img src="../static/generatedtext.png"></a>
        </div>
        <div class="navbar-collapse collapse navbar-responsive-collapse">
          <ul class="nav navbar-nav mr-auto">
            <li @click="toHome">
              <router-link to="">Home</router-link>
            </li>
            <li>
              <router-link to="/login" v-if="getToken == null">Login</router-link>
            </li>
            <li>
              <router-link to="/signup" v-if="getToken == null">Sign Up</router-link>
            </li>
            <li v-if="getToken != null" @click="addPost()">
              <router-link to="">Add Post</router-link>
            </li>
            <li v-if="getToken != null" @click="viewSettings()">
              <router-link to="">Profile Settings</router-link>
            </li>
            <li v-if="getToken != null && this.$route.path === '/'" class="nav-item dropdown btn-group">
              <router-link to="" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                           aria-expanded="true">
                Sort by
                <span class="caret"></span>
              </router-link>
              <ul class="dropdown-menu button-group">
                <li><a @click.prevent="sort('sortDate')" class="dropdown-item" style="cursor:pointer">Recently added</a>
                </li>
                <li><a @click.prevent="sort('sortLow')" class="dropdown-item"
                       style="cursor:pointer">Price: low to high</a></li>
                <li><a @click.prevent="sort('sortHigh')" class="dropdown-item"
                       style="cursor:pointer">Price: high to low</a></li>
              </ul>
            </li>
            <li v-if="getToken != null" @click="logOut()">
              <router-link to="">Logout</router-link>
            </li>
          </ul>
          <form v-if="getToken != null" class="form-inline waves-effect waves-light">
            <input type="text" class="form-control" placeholder="Search" style="margin-top: 8px">
          </form>
        </div>
      </div>
    </nav>
    <main style="margin-top:80px">
      <router-view></router-view>
      <router-view name="modal"></router-view>
    </main>
  </div>
</template>

<script>
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
      sort (sortValue) {
        this.$store.state.sortValue = ''
        this.$store.commit('setSort', sortValue)
      },
      /* toHome will route to the home page if the user has a valid token (is authenticated).
      Otherwise, the application will route to login for them to authenticate. */
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
      addPost () {
        if (this.$route.path === '/') {
          this.$router.push('/addpost')
        } else {
          this.$router.push('/addpost-profile')
        }
      },
      /* viewSettings makes an axios call to the corkboard API using the ID of the user
         that is currently signed in. The vuex state for the viewed profile is also changed
         to match the data of the current user. */
      viewSettings () {
        if (this.$router.currentRoute.path === '/') {
          axios({
            method: 'get',
            url: '/api/users/' + this.getCurrentUser,
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })
            .then(res => {
              this.$store.commit('getViewedProfile', res.data)
              this.$router.push('/viewProfile/' + this.getCurrentUser)
            })
            .catch(error => {
              // Token expiry (401). Route user to the login page
              if (error.response.status === 401) {
                this.$store.commit('authenticate', null)
                let vm = this
                setTimeout(function () {
                  vm.$router.push('/login')
                }, 100)
              }
            })
        }
      }
    }
  }
</script>

<style>
  body {
    background-color: #f1f1f1;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .container-fluid {
    padding-left: 2%;
    padding-right: 2%;
  }

  .navbar {
    box-shadow: 1px 2px 5px black;
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

  .modal-enter, .modal-leave {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
