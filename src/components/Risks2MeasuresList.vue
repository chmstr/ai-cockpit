<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens as risks2all } from "../lib/stores/risks2all";

import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Risk2Measure from "../components/Risk2Measure.vue";
import { MODAL_PROPS } from "../lib/shared/constants";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "Risk2Measure";
const ens_name = "Risks2Measures";

onMounted(() => {
  console.log("++++ R2M init start +++");
  risks2all.init();
});

const showForm = (id, collectionId) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  console.log("showForm: " + id);
  console.log("collectionId: " + collectionId);
  const dialogRef = dialog.open(Risk2Measure, {
    data: {
      id: id,
      collectionId: collectionId,
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

const confirmDelete = (event, en) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete?",
    header: "Confirmation",
    accept: () => {
      risks2all.remove(en); //delete from global ram + persistent list
    },
    onShow: () => {
      isVisible.value = true;
    },
    onHide: () => {
      isVisible.value = false;
    },
  });
};

function create() {
  showForm();
}

function formatDate(date) {
  return format(new Date(date), { date: "medium", time: "medium" });
}
</script>

<template>
  <section>
    <ConfirmPopup />
    <h2>{{ ens_name }} ({{ risks2all.current.length }} Einträge)</h2>
    <Button
      type="button"
      @click="create()"
      v-if="canEdit"
      class="kic_button kic_button_create"
      >Create New</Button
    >
    <DataTable
      :value="risks2all.current"
      dataKey="$id"
      showGridlines
      stripedRows
      paginator
      :rows="20"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="$updatedAt"
      :sortOrder="-1"
      tableStyle="min-width: 50rem"
    >
      <Column field="risk.title" header="Risiko" sortable></Column>
      <Column field="type" header="Risikobehandlung" sortable></Column>
      <Column field="mtype" header="Typ" sortable></Column>
      <Column field="mtitle" header="Maßnahme" sortable></Column>
      <Column v-if="false" field="$updatedAt" header="Letzte Änderung" sortable>
        <template #body="{ data }">
          {{ formatDate(data?.$updatedAt) }}
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <Button
            type="button"
            class="kic_button"
            @click="showForm(data.$id, data.$collectionId)"
          >
            Edit
          </Button>
          <Button
            v-if="user.current && canEdit"
            type="button"
            label="Delete"
            severity="danger"
            @click="confirmDelete($event, data)"
            outlined
            >Delete</Button
          >
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<style scoped></style>
../lib/stores/risk2measure
