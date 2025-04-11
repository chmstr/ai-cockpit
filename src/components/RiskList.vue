<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/risks";
import { MODAL_PROPS } from "../lib/shared/constants";
import { getBiasTypeLabel } from "../lib/shared/dropdowns";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Risk from "../components/Risk.vue";
import RiskRating from "../components/RiskRating.vue";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "Risiko";
const ens_name = "Risiken";
let ispoolmaster = false;

onMounted(() => {
  reloadEntities();
});

function reloadEntities() {
  ens.init();
}
const showEW = ref(false);
const showSP = ref(false);
const showREW = ref(false);
const showRSP = ref(false);
const showMeasures = ref(false);
const showUpdatedAt = ref(false);
const showBiastypes = ref(false);
const showModules = ref(false);
const showSystemId = ref(false);
const showPoolrisk = ref(false);
const showRating = ref(false);
const showAlarmcounter = ref(false);

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Risk, {
    data: {
      id: id,
    },
    props: {
      ...MODAL_PROPS,
      header: header,
      ispoolmaster: ispoolmaster,
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

function sortByName(modules) {
  return modules.sort(compare);
}

function compare(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

function updateModelValue(value) {
  console.log("updateModelValue", value);
}

function ratingChangeEvent(changeEvent) {
  console.log("ratingChangeEvent: originalEvent", changeEvent.originalEvent);
  console.log("ratingChangeEvent: data.rating", changeEvent.value);
  console.log("ratingChangeEvent: data.id", "???");
}

const handleRiskRatingChange = (event) => {
  console.log("Rating changed:", event.id, event.rating);
  // Perform your logic with the updated rating and id
};
</script>

<template>
  <section v-if="ens.current">
    <ConfirmPopup />
    <h2>
      {{ ens_name }}
      <i v-if="ispoolmaster"> im Risiko-Pool</i>
      ({{ ens.current.length }})
    </h2>

    <CreateButton :createMethod="create" />

    <ToggleButton
      class="togglecol"
      v-model="showEW"
      onLabel="EW: Eintrittswahrscheinlichkeit"
      offLabel="EW: Eintrittswahrscheinlichkeit"
    />
    <ToggleButton
      class="togglecol"
      v-model="showSP"
      onLabel="SP: Schadenspotential"
      offLabel="SP: Schadenspotential"
    />
    <ToggleButton
      class="togglecol"
      v-model="showREW"
      onLabel="REW: Rest-Eintrittswahrscheinlichkeit"
      offLabel="REW: Rest-Eintrittswahrscheinlichkeit"
    />
    <ToggleButton
      class="togglecol"
      v-model="showRSP"
      onLabel="RSP: Rest-Schadenspotential"
      offLabel="RSP: Rest-Schadenspotential"
    />
    <ToggleButton
      class="togglecol"
      v-model="showBiastypes"
      onLabel="Bias"
      offLabel="Bias"
    />
    <ToggleButton
      class="togglecol"
      v-model="showModules"
      onLabel="Module"
      offLabel="Module"
    />
    <ToggleButton
      class="togglecol"
      v-model="showMeasures"
      onLabel="Maßnahmen"
      offLabel="Maßnahmen"
    />
    <ToggleButton
      class="togglecol"
      v-model="showSystemId"
      onLabel="System-ID"
      offLabel="System-ID"
    />
    <ToggleButton
      class="togglecol"
      v-model="showRating"
      onLabel="Relevanz"
      offLabel="Relevanz"
    />
    <ToggleButton
      class="togglecol"
      v-model="showAlarmcounter"
      onLabel="Alarmzähler"
      offLabel="Alarmzähler"
    />

    <ToggleButton
      class="togglecol"
      v-model="showUpdatedAt"
      onLabel="Updated"
      offLabel="Updated"
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
      sortField="$updatedAt"
      :sortOrder="-1"
      tableStyle="min-width: 50rem"
    >
      <Column
        field="title"
        header="Risiko-Name"
        class="riskcolumn"
        sortable
        style="vertical-align: text-top"
      >
        <template #body="{ data }">
          {{ data.title }}
          <Tag
            v-if="data.poolriskId"
            severity="info"
            value="Poolrisiko"
            rounded
          ></Tag>
        </template>
      </Column>
      <Column
        v-if="showPoolrisk"
        field="poolriskId"
        header="Pool-Risiko"
        style="vertical-align: text-top"
        sortable
      ></Column>
      <Column
        v-if="showRating"
        field="rating"
        header="Relevanz"
        style="vertical-align: text-top"
        sortable
      >
        <template #body="{ data }">
          <RiskRating :initialData="{ id: data.$id, rating: data.rating }" />
          <!-- <RiskRating :risk="data" :initialData="{ id: data.$id, rating: data.rating }" /> -->
        </template>
      </Column>
      <Column
        v-if="showSystemId"
        field="systemId"
        header="System-ID"
        style="vertical-align: text-top"
        sortable
      ></Column>
      <Column v-if="showEW" field="probability" header="EW" sortable></Column>
      <Column v-if="showSP" field="impact" header="SP" sortable></Column>
      <Column
        v-if="showREW"
        field="residual_probability"
        header="REW"
        sortable
      ></Column>
      <Column
        v-if="showRSP"
        field="residual_impact"
        header="RSP"
        sortable
      ></Column>
      <Column
        v-if="showBiastypes"
        field="biastypes"
        header="Bias"
        style="vertical-align: text-top"
        sortable
      >
        <template #body="{ data }">
          <ul class="fieldlist">
            <li v-for="b in data.biastypes">{{ getBiasTypeLabel(b) }}</li>
          </ul>
        </template>
      </Column>
      <Column
        v-if="showModules"
        field="modules"
        header="Module"
        style="vertical-align: text-top"
        sortable
      >
        <template #body="{ data }">
          <ul class="fieldlist">
            <li v-for="m in sortByName(data.modules)">{{ m.title }}</li>
          </ul>
        </template>
      </Column>
      <Column
        v-if="showMeasures"
        field="measurelist"
        header="Maßnahmen"
        style="vertical-align: text-top"
        sortable
      >
        <template #body="{ data }">
          <ul class="fieldlist">
            <li v-for="d in data.measurelist">{{ d }}</li>
          </ul>
        </template>
      </Column>
      <Column
        v-if="showAlarmcounter"
        field="alarmcounter"
        header="Alarmzähler"
        sortable
      />
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
      <Column class="buttoncolumn">
        <template #body="{ data }">
          <Button type="button" class="kic_button" @click="showForm(data.$id)">
            Edit
          </Button>
          <Button
            type="button"
            label="Delete"
            severity="danger"
            @click="confirmDelete($event, data)"
            outlined
            v-if="canEdit"
            >Delete</Button
          >
        </template>
      </Column>
    </DataTable>
    <Button type="button" @click="reloadEntities()" class="kic_button">
      Refresh
    </Button>
  </section>
</template>

<style>
.buttoncolumn {
  max-width: 8rem;
}

.p-button-label {
  font-size: x-small;
}

.p-togglebutton .p-button {
  /*padding: 0.2rem 0.5rem;*/
  padding: 0.5rem 1rem;
  margin: 0.2rem;
}

.listtable {
  margin-top: 10px;
  min-width: 50rem;
  vertical-align: top;
}
</style>

<style scoped>
.fieldlist {
  padding-inline-start: 10px;
}

h2 {
  display: block;
}

.togglecol {
  font-size: smaller;
}

Button {
  margin-right: 20px;
}
</style>
