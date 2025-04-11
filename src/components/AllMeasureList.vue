<script setup>
import { ens } from "../lib/stores/allmeasures";
import { format } from "@formkit/tempo";

function formatDate(date) {
  return format(new Date(date), { date: "medium", time: "medium" });
}
</script>

<template>
  <h2>Alle Maßnahmen ({{ ens.current.length }})</h2>

  <DataTable
    v-if="true"
    :value="ens.current"
    dataKey="id"
    showGridlines
    stripedRows
    paginator
    :rows="50"
    :rowsPerPageOptions="[50, 100]"
    sortField="$updatedAt"
    :sortOrder="-1"
    tableStyle="min-width: 50rem"
  >
    <Column field="typename" header="Type" sortable></Column>
    <Column field="title" header="Maßnahme" sortable></Column>
  </DataTable>
</template>

<style scoped></style>
