<script setup>
import { user } from "../lib/stores/user";
import { ens } from "../lib/stores/logs";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Logentry from "../components/Logentry.vue";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "LogEntry";
const ens_name = "LogEntries";

onMounted(() => {
  ens.init();
});

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Logentry, {
    data: {
      id: id,
    },
    props: {
      header: header,
      modal: true,
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
      ens.remove(en.$id);
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
  <section v-if="ens.current">
    <ConfirmPopup />
    <h2>{{ ens_name }}</h2>

    <CreateButton :createMethod="create" />

    <DataTable
      :value="ens.current"
      dataKey="$id"
      showGridlines
      stripedRows
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      sortField="$updatedAt"
      :sortOrder="-1"
      tableStyle="min-width: 50rem"
    >
      <Column field="$createdAt" header="Timestamp" sortable>
        <template #body="{ data }">
          {{ formatDate(data.$createdAt) }}
        </template>
      </Column>
      <Column field="systemId" header="System-ID" sortable></Column>
      <Column field="action" header="Log-Message" sortable></Column>
      <Column field="userId" header="UserID" sortable></Column>
      <Column v-if="false" field="$updatedAt" header="updatedAt" sortable>
        <template #body="{ data }">
          {{ formatDate(data.$updatedAt) }}
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <Button type="button" class="kic_button" @click="showForm(data.$id)">
            View
          </Button>
          <Button
            v-if="false && user.current"
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
