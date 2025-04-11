<script setup>
import { user } from "../lib/stores/user";
import { ref } from "vue";

const email = ref("");
const password = ref("");
</script>

<template>
  <h1>Login or Register</h1>
  <section>
    <form>
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="button" @click="user.login(email, password)">Login</button>
      <button type="button" @click="user.register(email, password)">
        Register
      </button>
      {{ user.errormsg }}
    </form>
  </section>
</template>
<style scoped>
.spacer {
  min-height: 30px;
}

Button {
  margin: 5px;
}
</style>
