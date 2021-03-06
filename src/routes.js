/**
 * Created by savannahb on 6/13/17.
 */
import Posts from './components/Posts.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import AddPost from './components/AddPost.vue'
import ViewPost from './components/ViewPost.vue'
import UserProfile from './components/UserProfile.vue'
import EditProfile from './components/EditProfile.vue'
import EditPost from './components/EditPost.vue'
import PostPreview from './components/PostPreview.vue'

export const routes = [
  {path: '', component: Posts},
  {path: '/login', component: Login},
  {path: '/signup', component: Signup},
  {path: '/addpost', components: {default: AddPost, modal: Posts}},
  {path: '/addpost-profile', components: {default: AddPost, modal: UserProfile}},
  {path: '/viewPost/:post_id', components: {default: ViewPost, modal: Posts}},
  {path: '/editPost/:post_id', components: {default: EditPost, modal: UserProfile}},
  {path: '/editProfile/:user_id', components: {default: EditProfile, modal: UserProfile}},
  {path: '/viewProfile/:user_id', component: UserProfile},
  {path: '/postPreview/:post_id', components: {default: PostPreview, modal: UserProfile}},
  {path: '*', component: {template: '<h2>Uh oh! This page does not exist!</h2>'}}
]
