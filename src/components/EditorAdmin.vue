<script setup>
import { ref } from "vue";
import { format } from "@formkit/tempo";

const p = defineProps(["e"]);

function formatDate(date) {
  return format(new Date(date), { date: "medium", time: "medium" });
}
</script>

<template>
  <!-- <div v-if="p.e.$createdAt" class="entitydates"> -->
  <div v-if="p.e.$createdAt" class="entitydates">
    <table>
      <tr>
        <td>ID:</td>
        <td>{{ e.$id }}</td>
      </tr>
      <tr>
        <td>Erstellt:</td>
        <td>{{ formatDate(p.e.$createdAt) }}</td>
      </tr>
      <tr>
        <td>Aktualisiert:</td>
        <td>{{ formatDate(p.e.$updatedAt) }}</td>
      </tr>
    </table>
  </div>
  <FormKit
    type="text"
    name="systemId"
    label="System-ID"
    number="integer"
    help=""
    disabled="true"
  />
</template>

<style scoped></style>
