import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { routes } from './routes'

export const Masonry = require('masonry-layout')
export const imagesLoaded = require('imagesloaded')

Vue.use(VueRouter)
Vue.use(Vuex)

export const eventBus = new Vue()

const router = new VueRouter({
  routes: routes
})

// Vuex management here
// eslint-disable-next-line no-unused-vars
const store = new Vuex.Store({
  state: {
    isAuthenticated: false,
    // Likely not best practice to place these states here globally like this
    activePost: {
      title: '',
      price: null,
      description: '',
      imgSrc: null
    },
    viewedUserProfile: {
      firstName: '',
      lastName: '',
      email: ''
    }
  },
  mutations: {
    authenticate (state) {
      state.isAuthenticated = true
    },
    getActivePost (state, post) {
      state.activePost.title = post.post.title
      state.activePost.price = post.post.price
      state.activePost.description = post.post.description
      state.activePost.imgSrc = post.post.imgSrc
    },
    getViewedProfile (state, profile) {
      state.viewedUserProfile.firstName = profile.firstName
      state.viewedUserProfile.lastName = profile.lastName
      state.viewedUserProfile.email = profile.email
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
