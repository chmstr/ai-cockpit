<script setup>
import { ref, inject, onMounted } from "vue";
import {
  RULE_CHECKFREQ_OPTIONS,
  RULE_REPEATING_OPTIONS,
} from "../lib/shared/dropdowns";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/rules";
import { ens as moduleList } from "../lib/stores/modules";
import { ens as systems } from "../lib/stores/systems";
import { ens as kpis } from "../lib/stores/kpis";
import { format } from "@formkit/tempo";

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
const checkfreq = ref(0);
const repeating = ref(0);
const kpiOptionList = ref([]);
const kpi_id = ref();

let createdAt = "";
let updatedAt = "";
const en_name = "Regel";

const emit = defineEmits(["onCancel", "onSave"]);
let gid = "";
const moduleOptionList = ref([]);
const modules = ref([]);
const module_id = ref();

const dialogRef = inject("dialogRef");

onMounted(() => {
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

  kpiOptionList.value = kpis.option_list;

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
    editEntity.value.systemId = systems.systemId;
  }
});

function loadEntity(id) {
  let e = ens.current.filter((e) => e.$id === id)[0];
  editEntity.value = JSON.parse(JSON.stringify(e));
  createdAt = format(new Date(editEntity.value.$createdAt), {
    date: "medium",
    time: "medium",
  });
  updatedAt = format(new Date(editEntity.value.$updatedAt), {
    date: "medium",
    time: "medium",
  });

  moduleOptionList.value = moduleList.option_list;
  module_id.value = editEntity.value.module?.$id;
  //console.log("MODULE_ID: " + module_id.value);

  //console.log("rule.editEntity", editEntity);

  kpi_id.value = editEntity.value.kpi?.$id;
  console.log("kpi_id", kpi_id.value);
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

function testrule() {
  alert("testing will come soon ...");
}

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    description: editEntity.value.description,
    module: module_id.value,
    systemId: editEntity.value.systemId,
    kpi: kpi_id.value,
  };

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
                inputClass: 'unused',
                wrapperClass: 'save-wrapper',
                outerClass: 'save-outer',
                ignore: false,
              }"
               :config="{ disabled: !canEdit }">
        <FormKit type="text"
                 name="title"
                 label="Titel"
                 validation="required|not:Admin"
                 help=""
                 placeholder="Testfall Name" />

        <TabView>
          <TabPanel header="Basics">
            <FormKit type="textarea"
                     name="description"
                     label="Beschreibung"
                     rows="15"
                     help=""
                     placeholder="Testfall Beschreibung" />
          </TabPanel>
          <TabPanel header="Bedingung">
            <div for="kpis"
                 class="label">Beobachtete KPI:</div>
            <Listbox id="kpi"
                     v-model="kpi_id"
                     :options="kpiOptionList"
                     option-label="label"
                     option-value="value"
                     class="moduleclass" />

            <div class="grid-container">
              <!-- <div class="grid-item">
                <FormKit
                  type="textarea"
                  name="checkscript"
                  label="Überprüfungslogik"
                  help=""
                  outer-class="checkscript-outer"
                  wrapper-class="checkscript-wrapper"
                  placeholder="Hier die Überprüfungslogik abbilden, z.B. KPI1 > 30 oder Testcase3 = failed"
                />
              </div>
              <div class="grid-item testsection">
                <Button
                  class="test-button"
                  type="button"
                  @click="testrule()"
                  severity="danger"
                  outlined
                  >Test</Button
                >
              </div> -->

              <div class="grid-item">
                <label for="checkfreq"
                       class="formkit-label">Frequenz</label>
                <Listbox id="checkfreq"
                         v-model="checkfreq"
                         :options="RULE_CHECKFREQ_OPTIONS"
                         optionLabel="label"
                         class="checkfreq" />
              </div>
              <div class="grid-item">
                <label for="errorintervall"
                       class="formkit-label">Wiederholungs-Fehlertoleranz</label>
                <Listbox id="repeating"
                         v-model="repeating"
                         :options="RULE_REPEATING_OPTIONS"
                         optionLabel="label"
                         class="repeating" />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Automatische Aktionen">
            <FormKit type="text"
                     name="mailadresses"
                     label="Automatische Benachrichtigungs-Mail an:"
                     help="Mailadressen mit Komma getrennt eintragen"
                     placeholder="" />

            <label for="modules"
                   class="formkit-label">Automatische Änderung des Autonomie-Levels für Modul</label>
            <Listbox id="modules"
                     v-model="module_id"
                     :options="moduleOptionList"
                     optionLabel="label"
                     option-value="value"
                     class="modules-list"
                     style="margin-bottom: 20px" />

            <FormKit type="text"
                     name="mailadresses"
                     label="Änderung des Autonomie-Levels auf"
                     help=""
                     placeholder="" />
          </TabPanel>
          <TabPanel header="Admin">
            <EditorAdmin :e="editEntity" />
          </TabPanel>
        </TabView>

        <Button class="cancel-button"
                type="button"
                @click="cancel()"
                severity="danger"
                outlined>Cancel</Button>
      </FormKit>
    </div>
  </section>
  <section v-else>
    <p>Please login to create an entity.</p>
  </section>
</template>
<style scoped>
.testsection {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkfreq {
  min-width: 300px;
  width: 50%;
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  padding: 0px;
}

.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  /*border: 1px dotted rgba(0, 0, 0, 0.8);*/
  padding: 10px;
}
</style>
