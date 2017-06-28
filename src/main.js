import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { routes } from './routes'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import Axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

export { Masonry, imagesLoaded }
export const axios = Axios.create({
  baseURL: process.env.API_URL,
  headers: {'Content-Type': 'application/json'}
})

Vue.use(VueRouter)
Vue.use(Vuex)

export const eventBus = new Vue()
const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

// Vuex management here
// eslint-disable-next-line no-unused-vars
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isAuthenticated: false,
    // Perhaps a place to store the token?
    token: null,
    // Likely not best practice to place these states here globally like this
    activePost: {
      itemid: '',
      itemname: '',
      itemprice: null,
      itemdesc: '',
      // imgSrc: null,
      itemcat: '',
      salestatus: '',
      date: ''
    },
    viewedUserProfile: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      zip: '',
      id: ''
      // posts
    },
    currentUser: ''
  },
  mutations: {
    authenticate (state, token) {
      state.token = token
    },
    getActivePost (state, post) {
      state.activePost.itemid = post.post.itemid
      state.activePost.itemname = post.post.itemname
      state.activePost.itemprice = post.post.itemprice
      state.activePost.itemdesc = post.post.itemdesc
      // state.activePost.imgSrc = post.post.imgSrc
      state.activePost.date = post.post.date
      state.activePost.itemcat = post.post.itemcat
      state.activePost.salestatus = post.post.salestatus
    },
    getViewedProfile (state, profile) {
      state.viewedUserProfile.id = profile.id
      state.viewedUserProfile.firstname = profile.firstname
      state.viewedUserProfile.lastname = profile.lastname
      state.viewedUserProfile.email = profile.email
      state.viewedUserProfile.phone = profile.phone
      // state.viewedUserProfile.zip = profile.zip
    },
    getCurrentUser (state, user) {
      state.currentUser = user
    }
  }
})

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
