import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { routes } from './routes'

export const Masonry = require('masonry-layout')

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
    activePost: {
      title: '',
      price: null,
      description: '',
      imgSrc: null
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
