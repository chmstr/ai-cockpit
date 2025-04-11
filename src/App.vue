<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted, ref, watch } from "vue";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import LoginNew from "./pages/LoginNew.vue";
import {
  user,
  isGlobalAdmin,
  isSystemEditor,
  canEdit,
  roleName,
} from "./lib/stores/user.js";
import { ens as systems } from "./lib/stores/systems.js";

const isLoginPage = window.location.pathname === "/login";
const selectedSystemId = ref(systems.systemId);

onMounted(() => {
  user.init();
  systems.init();
});

watch(
  () => systems.systemId,
  (newSystemId) => {
    console.log("systems.change.watched: new=", newSystemId);
    selectedSystemId.value = newSystemId;
  }
);

function onSystemChange(event) {
  let id = event.value;
  console.log("selectedSystemId.value", id);
  systems.changeSystemId(id);
  selectedSystemId.value = id;
}

function test() {
  alert("test ");
}
</script>

<template>
  <div class="container">
    <div>
      <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
        <template #start>
          <span class="headertitle">
            <img src="/kic_hol_logo.png" width="300px"
          /></span>
        </template>
        <template #end v-if="user?.current">
          <span class="system">
            <span v-if="systems.isReloading == true" class="reloading"
              >reloading ...
            </span>
            Mandant:
            <Dropdown
              v-model="selectedSystemId"
              :options="systems.option_list"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a System"
              class="w-full md:w-14rem"
              @change="onSystemChange($event)"
            /> </span
          >&nbsp;&nbsp;
          <span class="headerusermail"
            >{{ user.current.email }} {{ roleName }}
          </span>
          <Button type="button" @click="user.logout()" class="kic_button"
            >Logout</Button
          >
        </template>
        <div></div>
      </Toolbar>
      <Login v-if="user.current == null" />
      <Login v-if="isLoginPage" />
      <LoginNew v-if="false && user.current == null" />
      <main>
        <Home v-if="user.current" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.system {
  margin-left: 10px;
}

.headerusermail {
  margin-right: 20px;
}

.reloading {
  margin-left: 10px;
}

.headertitle {
  font-weight: bolder;
}

.body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: grey;
}
</style>
