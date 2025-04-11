<script setup>
import { ref, onMounted } from "vue";
import { ens } from "../lib/stores/modules";
import DashboardModule from "./DashboardModule.vue";

const checked = ref(true);

onMounted(() => {
  ens.init();
});
</script>

<template>
  <div class="modulelist">
    <div v-for="module in ens.current" class="module">
      <DashboardModule :module="module" />
    </div>
  </div>
</template>
<style scoped>
.modulelist {
  display: flex;
  flex-wrap: wrap; /* Ermöglicht Umbruch in die nächste Zeile */
  gap: 10px; /* Abstand zwischen den Elementen */
}
.module {
  flex: 1 1 45%; /* Zweispaltig: nimmt ca. 45% der Breite */
  min-width: 200px; /* Mindestbreite, um die Lesbarkeit zu gewährleisten */
  padding: 10px;
  background-color: #f0f5ff;
  box-sizing: border-box; /* Padding wird in der Breite berücksichtigt */
  display: flex;
}
</style>
