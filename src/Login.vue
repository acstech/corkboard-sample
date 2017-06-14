<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Log In</h2>
        <p>Log in to your account to buy and sell on the marketplace!</p>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <div class="form-group">
            <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your username"
                    v-model="credentials.username"
            >
        </div>
        <div class="form-group">
            <input
                    type="password"
                    class="form-control"
                    placeholder="Enter your password"
                    v-model="credentials.password"
            >
        </div>
        <button class="btn btn-primary" @click.prevent="logIn()">Log In!</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                credentials: {
                    username: '',
                    password: ''
                },
                error: ''
            }
        },
        methods: {
            logIn() {
                var credentials = {
                    username: this.credentials.username,
                    password: this.credentials.password
                }
                // TODO: Add authentication steps
            }
        }
    }
</script>

<style scoped>

</style>