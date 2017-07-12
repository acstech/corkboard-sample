/**
 * Created by savannahb on 6/13/17.
 */
import ProductList from './components/ProductList.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import AddPost from './components/AddPost.vue'
import ViewPost from './components/ViewPost.vue'
import UserProfile from './components/UserProfile.vue'
import EditProfile from './components/EditProfile.vue'
import EditPost from './components/EditPost.vue'

export const routes = [
  {path: '', component: ProductList},
  {path: '/login', component: Login},
  {path: '/signup', component: Signup},
  {path: '/addpost', components: {default: AddPost, modal: ProductList}},
  {path: '/viewPost/:post_id', components: {default: ViewPost, modal: ProductList}},
  {path: '/editPost/:post_id', components: {default: EditPost, modal: UserProfile}},
  {path: '/editProfile/:user_id', components: {default: EditProfile, modal: UserProfile}},
  {path: '/viewProfile/:user_id', component: UserProfile},
  {path: '*', component: {template: '<h2>Uh oh! This page does not exist!</h2>'}}
]
