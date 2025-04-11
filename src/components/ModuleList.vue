<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/modules";
import { MODAL_PROPS } from "../lib/shared/constants";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Module from "../components/Module.vue";
import LevelChange from "../components/LevelChange.vue";
import { MODULE_LOGICTYPE } from "../lib/shared/dropdowns";
import CreateButton from "./CreateButton.vue";
import {
  ens as autonomylevels,
  getAutonomyLevelsByModuleId,
} from "../lib/stores/autonomylevels";
import RefreshButton from "./RefreshButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const showUpdateAt = ref(false);
const showRisks = ref(false);
const showLogictype = ref(false);
const showSystemId = ref(false);
const showALs = ref(true);
const showStoplevel = ref(true);
const en_name = "Modul";
const ens_name = "Module";

onMounted(() => {
  reload();
});

function reload() {
  ens.init();
  autonomylevels.init();
}

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Module, {
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

const showAutonomyLevelForm = (id) => {
  let header = "Update Autonomy-Level";
  const dialogRef = dialog.open(LevelChange, {
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

function getRiskTitles(e) {
  let titles = e.map((a) => a.title);
  return titles;
}

function getLogictype(e) {
  if (!e) return "";
  else return MODULE_LOGICTYPE.find((x) => x.value === e).label;
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

    <!-- <ToggleButton v-model="showRisks" onLabel="Risiken" offLabel="Risiken" /> -->
    <ToggleButton
      v-model="showLogictype"
      onLabel="Logiktyp"
      offLabel="Logiktyp"
    />
    <ToggleButton
      class="togglecol"
      v-model="showALs"
      onLabel="Autonomiestufen"
      offLabel="Autonomiestufen"
    />
    <DataTable
      :value="ens.current"
      dataKey="$id"
      tableClass="listtable"
      showGridlines
      stripedRows
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="title"
      :sortOrder="+1"
    >
      <Column
        field="title"
        header="Modul-Name"
        style="vertical-align: text-top"
        sortable
      ></Column>

      <Column
        v-if="showLogictype"
        field="logictype"
        header="Logiktype"
        style="vertical-align: text-top"
        sortable
      >
        <template #body="{ data }">
          {{ getLogictype(data.logictype) }}
        </template>
      </Column>
      <Column v-if="showRisks" field="risks" header="Risiken" sortable>
        <template #body="{ data }">
          <ul>
            <li v-for="title in getRiskTitles(data.risks)">{{ title }}</li>
          </ul>
        </template>
      </Column>
      <Column
        field="autonomylevel"
        header="Autonomie-Level"
        v-if="showALs"
        sortable
      >
        <template #body="{ data }">
          <DataTable
            :value="getAutonomyLevelsByModuleId(data.$id)"
            dataKey="$id"
            class="table"
            showGridlines
            sortField="level"
            :sortOrder="+1"
          >
            <Column field="level" header="Level"></Column>
            <Column field="title" header="Name"></Column>
          </DataTable>
          Aktueller Level: {{ data.autonomylevel }}<br />
          Stopp-Level: {{ data.stoplevel }}
        </template>
      </Column>
      <Column
        v-if="showUpdateAt"
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
          <Button type="button" @click="showForm(data.$id)" class="kic_button">
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

    <Button type="button" class="kic_button" severity="info" @click="reload"
      >Refresh</Button
    >
  </section>
</template>

<style scoped>
.listtable {
  margin-top: 10px;
  min-width: 50rem;
  vertical-align: top;
}

Button {
  margin-right: 20px;
}

.optionlabel {
  background-color: yellow;
  vertical-align: top;
}

.listoptions {
  background-color: red;
  vertical-align: middle;
}
</style>
