<script setup>
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/riskpool";
import { ens as myrisks } from "../lib/stores/risks";
import { ens as systems } from "../lib/stores/systems";
import { MODAL_PROPS } from "../lib/shared/constants";
import { useDialog } from "primevue/usedialog";
import { onMounted, ref, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import RiskpoolEditor from "./RiskpoolEditor.vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";

const props = defineProps({
  id: String,
  selectmode: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "Risiko-Pool";
const ens_name = "Risiken im Risiko-Pool";
let selectmode = false;
let editmode = true;
const showSystemId = ref(false);
const showUpdatedAt = ref(false);
const stars = ref(5);
//     riskid | relevance
// sdfasdfasd | 3
// d4tgr4asfd | 2

onMounted(() => {
  selectmode = props.selectmode;
  editmode = !selectmode;
  ens.init();
});

function refreshPage() {
  ens.init();
}

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(RiskpoolEditor, {
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

function selectRisk(id) {
  console.log("risk selected", id);
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

const msg = ref("");

function importRisks() {
  console.log("myrisks1:", myrisks);
  let importedrisks = 0;
  ens.list.forEach((poolrisk) => {
    if (poolrisk.rating && !poolrisk.imported && poolrisk.rating > 0) {
      let risk = {};
      risk.title = poolrisk.title;
      risk.name = poolrisk.name;
      risk.description = poolrisk.description;
      risk.systemId = systems.systemId;
      risk.userId = user.current.$id;
      risk.poolriskId = poolrisk.$id;
      risk.rating = poolrisk.rating;

      console.log("import copied poolrisk", risk);
      myrisks.add(risk);
      console.log("risk added");
      importedrisks++;
      poolrisk.imported = true;
      poolrisk.rating = -1;
    }
  });
  console.log("myrisks2:", myrisks);
  msg.value = "Imported " + importedrisks + " Risks.";
}

const filters = ref();
const initFilters = () => {
  filters.value = {
    rating: { value: [0, 5], matchMode: FilterMatchMode.BETWEEN },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};
</script>

<template>
  <section v-if="ens.list">
    <ConfirmPopup />
    <h2>{{ ens_name }} ({{ ens.list.length }})</h2>

    <Button
      v-if="editmode && canEdit"
      class="kic_button kic_create"
      type="button"
      @click="create()"
      >Neu</Button
    >

    <ToggleButton
      v-if="editmode"
      class="togglecol"
      v-model="showSystemId"
      onLabel="System-ID"
      offLabel="System-ID"
    />

    <ToggleButton
      v-if="editmode"
      class="togglecol"
      v-model="showUpdatedAt"
      onLabel="Last Modified"
      offLabel="Last Modified"
    />

    <!-- <span v-if="selectmode">{{ myrisks.poolriskIds }}</span>
    <hr />
    <span v-if="selectmode">{{ ens.list }}</span> -->

    <DataTable
      :value="ens.list"
      dataKey="$id"
      tableClass="listtable"
      showGridlines
      stripedRows
      paginator
      :rows="50"
      :rowsPerPageOptions="[50, 100]"
      sortField="$updatedAt"
      :sortOrder="-1"
      tableStyle="min-width: 50rem"
    >
      <Column
        v-if="false"
        field="$id"
        header="ID-Name"
        class=""
        sortable
        style="vertical-align: text-top"
      ></Column>
      <Column
        field="title"
        header="Kurzer Risiko-Name"
        class="riskcolumn"
        sortable
        style="vertical-align: text-top"
      ></Column>
      <Column
        field="name"
        header="Langer Risiko-Name"
        class=""
        sortable
        style="vertical-align: text-top"
      ></Column>
      <Column
        v-if="showUpdatedAt"
        field="$updatedAt"
        header="Last Modified"
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
      <Column v-if="false" field="$updatedAt" header="Letzte Änderung" sortable>
        <template #body="{ data }">
          {{ formatDate(data.$updatedAt) }}
        </template>
      </Column>
      <Column header="Quelle" field="source" sortable> </Column>
      <Column v-if="selectmode" header="Relevanz" field="rating" sortable>
        <template #body="{ data }">
          <span v-if="data.imported"> already imported </span>
          <span v-if="!data.imported">
            <Rating v-model="data.rating" :stars="5" />
          </span>
        </template>
      </Column>
      <Column v-if="selectmode" header="Comment" field="comment" sortable>
        <template #body="{ data }">
          <Textarea v-model="data.eval" rows="2" cols="10" />
        </template>
      </Column>
      <Column v-if="editmode">
        <template v-if="editmode" #body="{ data }">
          <Button
            type="button"
            @click="showForm(data.$id)"
            v-if="canEdit"
            class="kic_button"
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

  <Button
    v-if="selectmode && canEdit"
    type="button"
    class="kic_button"
    @click="importRisks()"
  >
    Import as own Risks
  </Button>
  <Button type="button" class="kic_button" @click="refreshPage">
    Refresh
  </Button>
  {{ msg }}
</template>

<style>
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
