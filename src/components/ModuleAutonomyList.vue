<script setup>
import { onMounted, ref } from "vue";
import AutonomyChart from "../components/AutonomyChart.vue";
import { useDialog } from "primevue/usedialog";
import { ens as modules } from "../lib/stores/modules";
import {
  ens as autonomylevels,
  getAutonomyLevelsByModuleId,
} from "../lib/stores/autonomylevels";
import { MODAL_PROPS } from "../lib/shared/constants";
import LevelChange from "../components/LevelChange.vue";

const dialog = useDialog();

const showAutonomyLevelForm = (id) => {
  let header = "Update Autonomy-Level";
  const dialogRef = dialog.open(LevelChange, {
    data: {
      id: id,
    },
    props: {
      ...MODAL_PROPS,
      header: header,
    },
    onCancel: (e) => {
      console.log(e);
    },
  });
};

onMounted(() => {
  reload();
});

function reload() {
  modules.init();
  autonomylevels.init();
}
</script>

<template>
  <DataTable
    :value="modules.current"
    dataKey="$id"
    class="table"
    showGridlines
    paginator
    :rows="20"
    :rowsPerPageOptions="[20, 50]"
    sortField="title"
    :sortOrder="+1"
  >
    <Column field="title" header="Modul-Name" sortable></Column>
    <Column field="autonomylevel" header="Aktuelle Stufe" sortable></Column>
    <Column field="stoplevel" header="Stopp Stufe" sortable></Column>
    <Column field="autonomylevels" header="Autonomie-Stufen">
      <template #body="{ data }">
        <!-- {{ data.autonomylevels }} -->

        <DataTable
          :value="getAutonomyLevelsByModuleId(data.$id)"
          dataKey="$id"
          class="table"
          showGridlines
          sortField="level"
          :sortOrder="+1"
        >
          <Column field="level" header="Level" sortable></Column>
          <Column field="title" header="Title" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
        </DataTable>
      </template>
    </Column>

    <Column>
      <template #body="{ data }">
        <Button
          type="button"
          severity="warning"
          @click="showAutonomyLevelForm(data.$id)"
        >
          Change Level</Button
        >
      </template>
    </Column>
  </DataTable>

  <Button type="button" severity="info" @click="reload">Refresh</Button>

  <div v-if="false" class="modulecharts">
    <div v-for="module in ens.current">
      <AutonomyChart :module="module" :key="module.$id + module.$updatedAt" />
    </div>
  </div>
</template>

<style scoped>
.activelevel {
  background-color: #dddddd;
}

.modulecharts {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
</style>
