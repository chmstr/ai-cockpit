<script setup>
import { user } from "../lib/stores/user";
import { ref } from 'vue'

const axios = {
    post: () => new Promise(r => setTimeout(r, 2000))
}

async function login(credentials) {
    const res = await axios.post(credentials)
    // do some login things now
    alert('Logged in!')
}

</script>

<template>
    <FormKit type="form"
             submit-label="Login"
             @submit="login">
        <FormKit name="email"
                 label="Email address"
                 validation="required|email" />
        <FormKit type="password"
                 name="password"
                 label="Password"
                 validation="required" />
    </FormKit>

</template>