<template>
    <div id="app">
        <nav class="navbar navbar-default">
            <div class="container">
                <ul class="nav navbar-nav">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/login"> <!--v-if="!user.authenticated"-->Login</router-link></li>
                    <li><router-link to="/signup"> <!--v-if="!user.authenticated"-->Sign Up</router-link></li>
                    <li><router-link to="/"> <!--v-if="user.authenticated" @click="logout()"-->Logout</router-link></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    import ProductList from './ProductList.vue'
    import Login from './Login.vue'
    import Signup from './Signup.vue'

    export default {
        name: 'app',
        components: {
            products: ProductList,
            login: Login,
            signup: Signup
        },
        data () {
            return {
                msg: 'Welcome to Your Marketplace App'
            }
        }
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
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

    a {
        color: #42b983;
    }
</style>
