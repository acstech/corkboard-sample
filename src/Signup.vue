<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Sign Up</h2>
        <p>Sign up now to buy and sell on the marketplace!</p>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <div class="form-group">
            <input
                    type="text"
                    class="form-control"
                    placeholder="First name"
                    v-model="newUser.firstname"
                    required
            >
        </div>
        <div class="form-group">
            <input
                    type="text"
                    class="form-control"
                    placeholder="Last name"
                    v-model="newUser.lastname"
                    required
            >
        </div>
        <div class="form-group">
            <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    v-model="newUser.username"
                    required
            >
        </div>
        <div class="form-group">
            <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    v-model="newUser.password"
                    required
            >
        </div>
        <div class="form-group">
            <input
                    type="password"
                    class="form-control"
                    placeholder="Confirm password"
                    v-model="newUser.confirmPassword"
                    required
            >
        </div>
        <button class="btn btn-primary" @click.prevent="register()">Register</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                newUser: {
                    firstname: '',
                    lastname: '',
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: ''
                },
                error: ''
            }
        },
        methods: {
            submit() {
                var registration = {
                    firstname: this.newUser.firstname,
                    lastname: this.newUser.lastname,
                    email: this.newUser.email,
                    username: this.newUser.username,
                    password: this.newUser.password,
                    confirmPassword: this.newUser.confirmPassword
                }
                // TODO: Add validation steps and perhaps send to add user endpoint?
            }
        }
    }
</script>

<style scoped>

</style>