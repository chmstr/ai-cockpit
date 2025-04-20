<script setup>
import { ref, inject, onMounted } from "vue";
import Autonomylevel from "../components/Autonomylevel.vue";
import { user, canEdit, roleName } from "../lib/stores/user";
import { ens } from "../lib/stores/modules";
import { ens as riskList } from "../lib/stores/risks";
import {
  ens as autonomylevels,
  getAutonomyLevelsByModuleId,
} from "../lib/stores/autonomylevels";
import { ens as systems } from "../lib/stores/systems";
import { MODULE_LOGICTYPE } from "../lib/shared/dropdowns";
import { MODAL2_PROPS } from "../lib/shared/constants";
import { getJson } from "../lib/shared/utils";
import { useDialog } from "primevue/usedialog";
import { useConfirm } from "primevue/useconfirm";
import CreateButton from "./CreateButton.vue";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);

const logictypeOptionList = ref([]);
const logictype = ref(0);
const riskOptionList = ref([]);
const risks = ref([]);
const risk_ids = ref([]);
// const autonomylevels = ref([]);
const collapsed_importsection = ref(true); //not used
let gid = "";

const dialogRef = inject("dialogRef");

onMounted(() => {
  autonomylevels.init();
  // console.log("onMounted: props.id = " + props.id);
  let tid = props.id;

  // console.log("-> onMounted: dialogRef = ");
  // console.log(dialogRef);
  const params = dialogRef?.value?.data;
  // console.log("-> params: ");
  // console.log(params);
  if (params?.id) {
    tid = params.id;
    //console.log("params.id = " + tid);
  }
  const id = tid;
  gid = tid;
  console.log("id = " + id);

  MODULE_LOGICTYPE.forEach((e) => {
    let o = {};
    o.value = e.value;
    o.label = e.label;
    logictypeOptionList.value.push(o);
  });

  riskList.current.forEach((e) => {
    let o = {};
    o.value = e.$id;
    o.label = e.title;
    riskOptionList.value.push(o);
    //console.log(o);
  });
  riskOptionList.value.sort((a, b) =>
    a.label > b.label ? 1 : b.label > a.label ? -1 : 0
  );

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
    // autonomylevelList.current = [];
    editEntity.value.systemId = systems.systemId;
  }
});

function create() {
  showAutonomylevelForm();
}

const showAutonomylevelForm = (id) => {
  let en_name = "Autonomiestufe";
  let header = "Neue " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Autonomylevel, {
    data: {
      id: id,
      moduleId: gid,
    },
    props: {
      ...MODAL2_PROPS,
      header: header,
    },
    onCancel: (e) => {
      console.log(e);
    },
  });
};

function loadEntity(id) {
  let srcEntity = ens.current.filter((e) => e.$id === id)[0];
  console.log("srcEntity1", srcEntity);

  //preferred deep copy according to:
  //https://medium.com/@saikiran-dev/absolute-modern-way-to-deep-clone-object-in-javascript-61f0282db8de
  //but can not copy a proxyObject, and therefore could not be used (and is slow ...)
  //editEntity.value = structuredClone(srcEntity);

  //editEntity.value = { ...srcEntity.value }; //shallow copy
  //back to the old day solution that worxs:
  editEntity.value = JSON.parse(JSON.stringify(srcEntity)); //deep copy with restrictions

  console.log("srcEntity2", srcEntity);
  console.log("editEntity", editEntity);

  risks.value = editEntity.value.risks;
  logictype.value = editEntity.value.logictype;

  editEntity.value.risks.forEach((e) => {
    risk_ids.value.push(e.$id);
  });

  // autonomylevels.value = editEntity.value.autonomylevels;

  // console.log("autonomylevel1: ", autonomylevelList.current);
  // autonomylevels.value = autonomylevelList.current;

  //  console.log("risks_ids: ", risk_ids);
  console.log("editEntity.value", editEntity.value);
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const confirmDelete = (event, en) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete?",
    header: "Confirmation",
    accept: () => {
      autonomylevels.remove(en.$id);
    },
    onShow: () => {
      isVisible.value = true;
    },
    onHide: () => {
      isVisible.value = false;
    },
  });
};

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    description: editEntity.value.description,
    autonomylevel: editEntity.value.autonomylevel,
    stoplevel: editEntity.value.stoplevel,
    systemId: editEntity.value.systemId,
    apiurl: editEntity.value.apiurl,
    apiurl_al_active: editEntity.value.apiurl_al_active,
    risks: risk_ids.value,
    logictype: logictype.value,
  };
  console.log(edit_values);

  if (gid?.length > 0) {
    let u = { ...edit_values, $id: gid };
    ens.update(u);
  } else {
    let a = { ...edit_values, userId: user.current.$id };
    ens.add(a);
  }

  showEditor.value = false;
  dialogRef?.value?.close();
};

const alsurl = ref("");
const alsjson = ref("");
async function readAls() {
  if (alsurl.value.length == 0)
    alsurl.value =
      "http://www.hypsi.de/dev/kic/api/simulator/api.php?name=autonomylevels";
  console.log("getALs from URL", alsurl.value);
  alsjson.value = await getJson(alsurl.value);
  console.log("got ALS", alsjson.value);
}

async function importAls() {
  console.log(alsjson.value.levels);
  alsjson.value.levels.forEach((al) => {
    let edit_values = {
      level: parseInt(al.level),
      title: al.name,
      description: al.desc,
      modules: gid,
    };
    console.log(edit_values);

    let a = { ...edit_values, userId: user.current.$id };

    //TODOOOOO
    //autonomylevelList.add(a);
  });
  loadEntity(gid);
  collapsed_importsection.value = true;
  //alert("in implementation");
}
</script>

<template>
  <section v-if="user.current">
    <div v-if="showEditor"
         class="container">
      <FormKit type="form"
               @submit="formSubmit"
               submit-label="Save"
               #default="{ value }"
               prefix-icon="check"
               v-model="editEntity"
               :submit-attrs="{
                class: 'toms-button',
                inputClass: 'unused',
                wrapperClass: 'save-wrapper',
                outerClass: 'save-outer',
                ignore: false,
              }"
               :config="{ disabled: !canEdit }">
        <FormKit type="text"
                 name="title"
                 label="Name"
                 validation="required|not:Admin"
                 placeholder="Modul-Name"
                 help="" />

        <TabView>
          <TabPanel v-if="!isNew"
                    header="Autonomiestufen">
            <CreateButton :createMethod="create" />

            <DataTable :value="getAutonomyLevelsByModuleId(gid)"
                       dataKey="$id"
                       resizableColumns
                       columnResizeMode="expand"
                       showGridlines
                       stripedRows
                       sortField="level"
                       :sortOrder="+1"
                       tableClass="al_table"
                       tableStyle="padding: 0.3rem">
              <Column field="level"
                      header="Stufe (ID)"
                      bodyClass="text-center"></Column>
              <Column field="title"
                      header="Name der Autonomiestufe"></Column>
              <!-- <Column field="description"
                      header="Beschreibung"></Column> -->
              <Column>
                <template #body="{ data }">
                  <Button type="button"
                          class="kic_button"
                          @click="showAutonomylevelForm(data.$id)">
                    Edit
                  </Button>
                  <Button v-if="user.current && canEdit"
                          type="button"
                          label="Delete"
                          severity="danger"
                          @click="confirmDelete($event, data)"
                          outlined>Delete</Button>
                </template>
              </Column>
            </DataTable>

            <FormKit type="text"
                     name="autonomylevel"
                     label="Aktuelle Stufe"
                     number="integer"
                     validation=""
                     placeholder="Autonomie-Level"
                     wrapper-class="al_start"
                     help="" />

            <FormKit type="text"
                     name="stoplevel"
                     number="integer"
                     label="Autonomielevel bei Stopptaste"
                     placeholder="Stopplevel"
                     wrapper-class="al_start"
                     help="Das ist der Autonomielevel, in den das Modul bei Drücken der Stopptaste versetzt wird." />

            <Fieldset legend="Automatischer Import der Autonomiestufen über KIC-API"
                      :toggleable="true"
                      :collapsed="true">
              <span class="apilabel">KIC-API-URL zum Auslesen der Autonomiestufen</span>
              <input v-model="alsurl"
                     size="70"
                     placeholder="http://www.hypsi.de/dev/kic/api/simulator/api.php?name=autonomylevels"
                     class="alsurl" />

              <br /><Button label="1. Read Autonomy-Level from API"
                      @click="readAls"
                      type="button"></Button>

              <Button v-if="alsjson.levels?.length > 0"
                      label="2. Import Autonomy-Levels into KI-Cockpit"
                      @click="importAls"
                      type="button"></Button>

              <DataTable :value="alsjson.levels"
                         showGridlines
                         stripedRows
                         tableClass="al_table"
                         tableStyle="padding: 0.3rem">
                <Column field="level"
                        header="Level"
                        bodyClass="text-center"></Column>
                <Column field="name"
                        header="Name"
                        bodyClass="text-center"></Column>
                <Column field="desc"
                        header="Description"
                        bodyClass="text-center"></Column>
              </DataTable>
            </Fieldset>
          </TabPanel>

          <TabPanel header="Beschreibung">
            <FormKit type="textarea"
                     name="description"
                     label="Beschreibung"
                     placeholder="Modul-Beschreibung"
                     rows="15"
                     help="" />
          </TabPanel>
          <TabPanel header="Klassifikation">
            <label for="logictype">Logiktyp</label>
            <Listbox id="logictype"
                     v-model="logictype"
                     :options="logictypeOptionList"
                     option-label="label"
                     option-value="value"
                     class="fontsmaller" />

            <!-- <FormKit type="radio"
                     label="Lerntyp"
                     :options="[
    'fertig trainiert',
    'zeitweise weiterlernend',
    'permanent weiterlernend',
  ]"
                     validation="" /> -->
          </TabPanel>
          <TabPanel v-if="!isNew"
                    header="Risiken">
            <label for="risks">Relevante Risiken:</label>
            <Listbox id="risks"
                     v-model="risk_ids"
                     :options="riskOptionList"
                     multiple
                     option-label="label"
                     option-value="value"
                     class="" />
          </TabPanel>
          <TabPanel header="API-Config.">
            <FormKit type="text"
                     name="apiurl"
                     label="API-Endpunkt für dieses Modul"
                     placeholder=""
                     help="z.B. https://www.kisystem.de/kicapi/v1/modules/1234/" />
            <FormKit type="text"
                     name="apiurl_al_active"
                     label="Gesonderter API-Endpunkt nur für Autonomie-Stufen-Änderung (optional)"
                     placeholder=""
                     help="z.B. https://www.kisystem.de/kicapi/v1/modules/1234/autonomy-levels/active" />
          </TabPanel>
          <TabPanel header="Admin">
            <EditorAdmin :e="editEntity" />
          </TabPanel>
        </TabView>

        <Button class="cancel-button"
                type="button"
                @click="cancel()"
                severity="danger"
                outlined>
          Cancel</Button>
      </FormKit>
    </div>
  </section>
  <section v-else>
    <p>Please login to create an entity.</p>
  </section>
</template>

<style>
.apilabel {
  display: block;
}

#logictype_list {
  font-size: smaller;
}

.al_table .p-datatable-tbody>tr>td {
  padding: 0.4rem;
  min-width: 30%;
}

.al_table {
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
}

.al_start {
  max-width: 100px;
}
</style>

<style scoped>
.p-datatable .p-datatable-tbody>tr>td {
  padding: 0.3rem;
  background-color: red;
}

.alsurl {
  font-size: large;
}

.container {
  display: flex;
  flex-direction: column;
}

.small-input {
  width: 3ch;
  min-width: 3ch;
  max-width: 3ch;
  text-align: center;
}
</style>
