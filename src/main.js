import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueCarousel from 'vue-carousel'
import { routes } from './routes'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import Axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

export { Masonry, imagesLoaded }

// Set axios API call defaults to the Corkboard API
Axios.defaults.baseURL = process.env.API_URL
Axios.defaults.headers.common['Content-Type'] = 'application/json'

// Use the vue routing and state management tools
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueCarousel)

const router = new VueRouter({
  routes: routes
})

// Vuex management here
// eslint-disable-next-line no-unused-vars
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    // Perhaps a place to store the token?
    token: null,
    defaultPostImage: 'static/posttext.png',
    currentSort: 'sortDate',
    // Likely not best practice to place these states here globally like this
    // State for the post being viewed or previewed
    activePost: {
      id: '',
      name: '',
      price: null,
      description: '',
      picid: [],
      url: [],
      category: '',
      salestatus: '',
      date: '',
      userid: ''
    },
    savedPost: {
      name: '',
      price: null,
      description: '',
      category: ''
    },
    activeSeller: '',
    // State for the current user profile page information
    viewedUserProfile: {
      picid: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      zipcode: '',
      url: '',
      id: '',
      items: [],
      profPicLoaded: null
    },
    activeEmail: '',
    // Represents the current user by their ID
    currentUser: '',
    allPosts: []
  },
  mutations: {
    // Manages the token given to the user
    authenticate (state, token) {
      state.token = token
    },
    setSort (state, sortValue) {
      state.sortValue = sortValue
    },
    // Sets the active post with the latest request information
    getActivePost (state, post) {
      var idArray = []
      var urlArray = []
      state.activePost.id = post.post.id
      state.activePost.name = post.post.name
      state.activePost.price = post.post.price
      state.activePost.description = post.post.description
      if (post.post.picid && typeof post.post.picid === typeof []) {
        for (var i = 0; i < post.post.picid.length; ++i) {
          idArray.push(post.post.picid[i])
          urlArray.push(post.post.url[i])
        }
      }
      state.activePost.picid = idArray
      state.activePost.url = urlArray
      state.activePost.date = post.post.date
      state.activePost.category = post.post.category
      state.activePost.salestatus = post.post.salestatus
      state.activePost.userid = post.post.userid
    },
    getSavedPost (state, post) {
      state.activePost.name = post.name
      state.activePost.price = post.price
      state.activePost.description = post.description
      state.activePost.category = post.category
    },
    getActiveEmail (state, user) {
      state.activeEmail = user.user.email
    },
    getActiveSeller (state, user) {
      if (user.user.firstname && user.user.lastname) {
        state.activeSeller = user.user.firstname + ' ' + user.user.lastname
      } else {
        state.activeSeller = user.user.email
      }
    },
    // Sets the active user profile view with the latest request information
    getViewedProfile (state, profile) {
      state.viewedUserProfile.picid = profile.picid
      state.viewedUserProfile.url = profile.url
      state.viewedUserProfile.id = profile.id
      state.viewedUserProfile.firstname = profile.firstname
      state.viewedUserProfile.lastname = profile.lastname
      state.viewedUserProfile.email = profile.email
      state.viewedUserProfile.phone = profile.phone
      state.viewedUserProfile.items = profile.items
      state.viewedUserProfile.zipcode = profile.zipcode
    },
    getCurrentUser (state, user) {
      state.currentUser = user
    },
    getAllPosts (state, posts) {
      state.allPosts = posts
    }
  }
})

// Formats plain number prices to match the USD formatting
Vue.filter('currency', function (value) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(value)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
})
