<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/systems";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import System from "../components/System.vue";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "System";
const ens_name = "Systems";

onMounted(() => {
  ens.init();
});

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(System, {
    data: {
      id: id,
    },
    props: {
      header: header,
      modal: true,
      maximizable: true,
      style: {
        width: "75vw",
      },
      breakpoints: {
        "960px": "85vw",
        "640px": "90vw",
      },
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

function setSystemId(sid) {
  console.log("systems.setSystemId:", sid);
  ens.changeSystemId(sid);
}

function create() {
  showForm();
}
</script>

<template>
  <section v-if="ens.current">
    <ConfirmPopup />
    <h2>Systeme ({{ ens.current.length }})</h2>

    <CreateButton :createMethod="create" />

    <DataTable
      :value="ens.current"
      dataKey="$id"
      showGridlines
      stripedRows
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="title"
      :sortOrder="+1"
      tableStyle="min-width: 50rem"
    >
      <Column field="systemId" header="System-ID" sortable></Column>
      <Column field="seq" header="Prio" sortable></Column>
      <Column field="title" header="Name" sortable></Column>
      <Column>
        <template #body="{ data }">
          <Button
            type="button"
            severity="help"
            @click="setSystemId(data.systemId)"
            v-if="user.current && canEdit"
          >
            Switch
          </Button>
          <Button type="button" @click="showForm(data.$id)" v-if="canEdit">
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

<style scoped>
Button {
  margin-right: 20px;
}
</style>
