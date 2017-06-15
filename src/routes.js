/**
 * Created by savannahb on 6/13/17.
 */
import ProductList from './components/ProductList.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import AddPost from './components/AddPost.vue'
import ViewPost from './components/ViewPost.vue'

export const routes = [
        {path: '', component: ProductList},
        {path: '/login', component: Login},
        {path: '/signup', component: Signup},
        {path: '/addpost', components: {default: AddPost, modal: ProductList}},
        {path: '/viewPost/:post_id', components: {default: ViewPost, modal: ProductList}},
        {path: '*', component: ProductList}
]
