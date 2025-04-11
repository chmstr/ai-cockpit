<script setup>
import { defineProps } from "vue";
import { canEdit } from "../lib/stores/user";

const props = defineProps(["createMethod"]);
</script>

<template>
  <Button
    @click="props.createMethod"
    class="kic_button kic_button_create"
    v-if="canEdit"
    >Create New</Button
  >
</template>
<style scoped></style>
