<script setup>
import { onMounted, ref } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/testcases";
import { useDialog } from "primevue/usedialog";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Testcase from "../components/Testcase.vue";
import {
  getTestcaseTectypeLabel,
  getTestcasePytypeLabel,
} from "../lib/shared/dropdowns";
import { MODAL_PROPS } from "../lib/shared/constants";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const showTectype = ref(false);
const showPytype = ref(false);
const showUpdatedAt = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "Testcase";
const ens_name = "Testcases";

onMounted(() => {
  ens.init();
});

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Testcase, {
    data: {
      id: id,
    },
    props: { ...MODAL_PROPS, header: header },
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
    <h2>Testcases ({{ ens.current.length }})</h2>
    <CreateButton :createMethod="create" />
    <ToggleButton
      v-model="showTectype"
      onLabel="Test-Typ"
      offLabel="Test-Typ"
    />
    <ToggleButton
      v-model="showPytype"
      onLabel="Test-Pyramiden-Typ"
      offLabel="Test-Pyramiden-Typ"
    />
    <ToggleButton
      v-model="showUpdatedAt"
      onLabel="Letzte Änderung"
      offLabel="Letzte Änderung"
    />

    <DataTable
      :value="ens.current"
      dataKey="$id"
      showGridlines
      stripedRows
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="$updatedAt"
      :sortOrder="-1"
      tableStyle="min-width: 50rem"
    >
      <Column field="title" header="Testcase-Name" sortable></Column>
      <Column v-if="showTectype" field="tectype" header="Test-Type" sortable>
        <template #body="{ data }">
          {{ getTestcaseTectypeLabel(data.tectype) }} </template
        >"
      </Column>
      <Column
        v-if="showPytype"
        field="pytype"
        header="Test-Pyramiden-Typ"
        sortable
      >
        <template #body="{ data }">
          {{ getTestcasePytypeLabel(data.pytype) }} </template
        >"
      </Column>
      <Column
        v-if="showUpdatedAt"
        field="$updatedAt"
        header="Letzte Änderung"
        sortable
      >
        <template #body="{ data }">
          {{ formatDate(data.$updatedAt) }}
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <Button type="button" class="kic_button" @click="showForm(data.$id)">
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
