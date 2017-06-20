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
    isAuthenticated: false
  },
  mutations: {
    authenticate (state) {
      state.isAuthenticated = true
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
