<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/kpis";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import { MODAL_PROPS } from "../lib/shared/constants.js";
import Kpi from "../components/Kpi.vue";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "KPI";
const ens_name = "KPIs";
const showModules = ref(false);
const showUpdatedAt = ref(false);
const showSystemId = ref(false);
const showChartSeq = ref(false);

onMounted(() => {
  ens.init();
});

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Kpi, {
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
    <h2>{{ ens_name }} ({{ ens.current.length }})</h2>
    <CreateButton :createMethod="create" />
    <ToggleButton v-model="showModules" onLabel="Module" offLabel="Module" />
    <ToggleButton
      v-model="showUpdatedAt"
      onLabel="Letzte Änderung"
      offLabel="Letzte Änderung"
    />
    <ToggleButton
      class="togglecol"
      v-model="showChartSeq"
      onLabel="Dashboard Prio"
      offLabel="Dashboard Prio"
    />
    <ToggleButton
      class="togglecol"
      v-model="showSystemId"
      onLabel="System-ID"
      offLabel="System-ID"
    />

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
      <Column field="title" header="KPI-Name" sortable></Column>
      <Column
        v-if="showChartSeq"
        field="chartseq"
        header="Dashobard Prio"
        style="vertical-align: text-top"
        sortable
      ></Column>
      <Column
        v-if="showSystemId"
        field="systemId"
        header="System-ID"
        style="vertical-align: text-top"
        sortable
      ></Column>

      <Column v-if="showModules" field="modules" header="Module" sortable>
        <template #body="{ data }">
          <ul>
            <li v-for="module in data.modules">{{ module.title }}</li>
          </ul>
        </template>
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

<style scoped></style>
