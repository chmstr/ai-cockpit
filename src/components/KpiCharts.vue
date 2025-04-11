<script setup>
import { onMounted, ref } from "vue";
import KpiChart from "../components/KpiChart.vue";
import { ens } from "../lib/stores/kpis";

const kpicharts = ref([]);

onMounted(() => {
  ens.init();
  kpicharts.value = ens.current;
  kpicharts.value.sort((a, b) =>
    a.chartseq > b.chartseq ? -1 : b.chartseq > a.chartseq ? 1 : 0
  );
  console.log("kpicharts: ens.current", ens.current);
  console.log("kpicharts", kpicharts.value);
});
</script>

<template>
  <div class="kpicharts">
    <KpiChart
      v-for="kpi in ens.current"
      :kpi="kpi"
      :key="kpi.$id + kpi.$updatedAt"
    />
  </div>
</template>
<style scoped>
.kpicharts {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
