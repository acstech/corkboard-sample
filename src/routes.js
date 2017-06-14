/**
 * Created by savannahb on 6/13/17.
 */
import ProductList from './ProductList.vue'
import Login from './Login.vue'
import Signup from './Signup.vue'
import AddPost from './AddPost.vue'

export const routes = [
        {path: '', component: ProductList},
        {path: '/login', component: Login},
        {path: '/signup', component: Signup},
        {path: '/addpost', components: {default: AddPost, modal: ProductList}},
        {path: '*', component: ProductList},
]
