<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/risks";
import { ens as systems } from "../lib/stores/systems";
import {
  RISK_IMPACT_OPTIONS,
  RISK_PROBABILITY_OPTIONS,
  TESTCASE_BIASTYPE_OPTIONS,
  getBiasTypeDesc,
  getBiasTypeLabel,
} from "../lib/shared/dropdowns";
import { ens as moduleList } from "../lib/stores/modules";

const props = defineProps({
  id: String,
  ispoolmaster: {
    type: Boolean,
    default: false,
  },
});

const editEntity = ref(""); //generic entity name (ens = sein)
const srcEntity = ref("");
const isNew = ref(false);
const showEditor = ref(true);
let ispoolmaster = false;

let gid = "";

const dialogRef = inject("dialogRef");
const moduleOptionList = ref([]);
const modules = ref([]);
const modules_ids = ref([]);
const impactOptionList = ref([]);
const probabilityOptionList = ref([]);
const forallmodules = ref(false);
const biasTypeDesc = ref("");
const biasTypeName = ref("");
const biasTypeTabList = ref([]);
let counter = 0;

onMounted(() => {
  ispoolmaster = props.ispoolmaster;

  let tid = props.id;
  const params = dialogRef?.value?.data;
  if (params?.id) {
    tid = params.id;
  }
  const id = tid;
  gid = tid;
  console.log("id = " + id);

  if (params?.ispoolmaster) {
    ispoolmaster = params.ispoolmaster;
    console.log("ispoolmaster in params", params);
  }
  console.log("ispoolmaster", ispoolmaster);

  moduleOptionList.value = moduleList.option_list;

  RISK_IMPACT_OPTIONS.forEach((e) => {
    impactOptionList.value.push(e);
    //console.log(e);
  });

  RISK_PROBABILITY_OPTIONS.forEach((e) => {
    probabilityOptionList.value.push(e);
    //console.log(e);
  });

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
    editEntity.value.systemId = systems.systemId;
    console.log("systems.systemId: " + systems.systemId);
    console.log("editEntity systemID set?: ", editEntity.value);
  }
});

let oldBiasTypes = [];

watch(editEntity, async (n, o) => {
  if (n.biastypes?.length > oldBiasTypes?.length) {
    biasTypeDesc.value += " added!";

    // Find elements in b that are not in a
    let a = oldBiasTypes;
    let b = n.biastypes;
    let newBiasType = b.filter((item) => !a.includes(item));
    let inttype = parseInt(newBiasType);
    biasTypeDesc.value = inttype;
    //console.log("newBiasType: " + inttype);
    biasTypeDesc.value = getBiasTypeDesc(inttype);
    biasTypeName.value = getBiasTypeLabel(inttype);
  } else {
    biasTypeName.value = "";
    biasTypeDesc.value = "";
  }
  oldBiasTypes = n.biastypes;
});

function loadEntity(id) {
  let e = ens.current.filter((e) => e.$id === id)[0];
  srcEntity.value = e;
  editEntity.value = JSON.parse(JSON.stringify(e));

  modules.value = editEntity.value.modules;
  editEntity.value.modules.forEach((m) => {
    modules_ids.value.push(m.$id);
  });

  //console.log("modules_ids: ", modules_ids);
  //console.log("editEntity.value", editEntity.value);
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const formSubmit = (fields) => {
  let logaction = "";

  console.log("submitted modules", modules);

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    name: editEntity.value.name,
    description: editEntity.value.description,
    forallmodules: editEntity.value.forallmodules,
    modules: modules_ids.value,
    biastypes: editEntity.value.biastypes,
    impact: editEntity.value.impact,
    probability: editEntity.value.probability,
    residual_impact: editEntity.value.residual_impact,
    residual_probability: editEntity.value.residual_probability,
    systemId: editEntity.value.systemId,
    rating: editEntity.value.rating,
  };
  console.log("edit_values: ", edit_values);

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

function changeBiasTypes(biastypes) {
  //console.log(biastypes);
  biasTypeTabList.value = [];
  biastypes.forEach((biastype) => {
    let tab = {};
    tab.title = getBiasTypeLabel(biastype);
    tab.content = getBiasTypeDesc(biastype);
    biasTypeTabList.value.push(tab);
  });
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
                inputClass: 'unused',
                wrapperClass: 'save-wrapper',
                outerClass: 'save-outer',
                ignore: false,
              }"
               :config="{ disabled: !canEdit }">
        <Tag v-if="editEntity.poolriskId"
             severity="info"
             value="Poolrisiko"
             rounded></Tag>
        <FormKit type="text"
                 name="title"
                 label="Name (kurz)"
                 validation="required|not:Admin"
                 placeholder="Kurzer Risiko-Name"
                 help="" />
        <FormKit type="textarea"
                 name="name"
                 rows="2"
                 label="Name (lang)"
                 placeholder="Langer Risiko-Name"
                 help="" />
        Relevanz:
        <Rating v-model="editEntity.rating"
                :stars="5" />

        <TabView>
          <TabPanel header="Basics">
            <FormKit type="textarea"
                     name="description"
                     label="Beschreibung"
                     rows="15"
                     placeholder="Risiko-Beschreibung"
                     help="" />
          </TabPanel>
          <TabPanel v-if="!ispoolmaster"
                    header="Einstufung">
            <Splitter>
              <SplitterPanel>
                <div class="grid-item">
                  <label for="probability">Eintrittswahrscheinlichkeit:</label>
                  <Listbox id="probability"
                           v-model="editEntity.probability"
                           :options="probabilityOptionList"
                           option-label="label"
                           option-value="value"
                           class="small_listbox" />
                </div>
                <div class="grid-item">
                  <label for="impact">Schadenspotential:</label>
                  <Listbox id="impact"
                           v-model="editEntity.impact"
                           :options="impactOptionList"
                           option-label="label"
                           option-value="value"
                           class="small_listbox" />
                </div>
              </SplitterPanel>
              <SplitterPanel>
                <div class="splitter_header">Maßnahmen:</div>

                <ol>
                  <li v-for="m in srcEntity.measurelist">{{ m }}</li>
                </ol>
                <span v-if="!srcEntity.measurelist"
                      class="emptymeasurelist">Bislang keine Maßnahmen angelegt.</span>
              </SplitterPanel>
              <SplitterPanel>
                <div class="grid-item">
                  <label for="residual_probability">Rest-Eintrittswahrscheinlichkeit:</label>
                  <Listbox id="residual_probability"
                           v-model="editEntity.residual_probability"
                           :options="probabilityOptionList"
                           option-label="label"
                           option-value="value"
                           class="small_listbox" />
                </div>
                <div class="grid-item">
                  <label for="residual_impact">Rest-Schadenspotential:</label>
                  <Listbox id="impact"
                           v-model="editEntity.residual_impact"
                           :options="impactOptionList"
                           option-label="label"
                           option-value="value"
                           class="small_listbox" />
                </div>
              </SplitterPanel>
            </Splitter>
          </TabPanel>
          <TabPanel v-if="!ispoolmaster"
                    header="Module">
            <InputSwitch label="Für alle Module"
                         v-model="editEntity.forallmodules" />
            Für alle Module relevant<br />
            <br />
            Nur relevant für folgende Module:
            <Listbox id="modules"
                     v-model="modules_ids"
                     :options="moduleOptionList"
                     multiple
                     option-label="label"
                     option-value="value"
                     class="" />
          </TabPanel>
          <TabPanel header="Bias">
            <div class="row">
              <div class="biascolumn">
                <label class="label"
                       for="biastype">Relevante Bias-Typen:</label>
                <Listbox id="biastypes"
                         placeholder="Bias-Typ"
                         v-model="editEntity.biastypes"
                         optionValue="value"
                         optionLabel="label"
                         multiple
                         checkmark
                         class="dropdown"
                         @update:modelValue="changeBiasTypes"
                         :options="TESTCASE_BIASTYPE_OPTIONS"></Listbox>
              </div>
              <div class="desc">
                <h3 class="desctitle">{{ biasTypeName }}</h3>
                <div v-html="biasTypeDesc" />

                <!-- <Accordion :multiple="true"
                                           :activeIndex="0">
                                    <AccordionTab v-for="tab in biasTypeTabList"
                                                  :key="tab.title"
                                                  :header="tab.title">
                                        <p class="m-0"
                                           v-html="tab.content"></p>
                                    </AccordionTab>
                                </Accordion> -->
              </div>
            </div>

            <Fieldset legend="Bias Information"
                      :toggleable="true"
                      :collapsed="true">
              <p class="m-0">
                Beachte, dass sich die einzelnen Bias-Arten nicht gegenseitig
                ausschließen, d. h. ein KI-System kann unter mehr als einer Art
                von Bias leiden. Beispielsweise können KI-Systeme in
                Fitness-Trackern Repräsentationsverzerrung enthalten, wenn
                dunklere Hauttöne im Trainingsdatensatz nicht enthalten sind,
                Messverzerrung enthalten, wenn der Fitness-Tracker bei dunklen
                Hauttönen eine geringere Leistungsfähigkeit aufweist und
                Bewertungsverzerrungen enthalten, wenn der Datensatz, der zur
                Bewertung des KI-Systems verwendet wird, keine dunklen Hauttöne
                enthält. Mehr dazu: https://www.youtube.com/watch?v=vVRWeGlMkGk.
                (Quelle: https://bias-and-fairness-in-ai-systems.de/grundlagen/)
              </p>
            </Fieldset>
          </TabPanel>
          <TabPanel header="Admin">
            Rating: {{ editEntity.rating }}
            <!-- <FormKit label="Rating" type="number" name="rating" /> -->

            Pool-Risiko-ID: {{ editEntity.poolriskId }}<br />
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
<style>
.p-rating {
  display: inline;
}
</style>
<style scoped>
.label {
  margin-right: 20px;
  display: inline-flex;
}

#xbiastypes {
  display: inline-flex;
}

.row {
  display: flex;
  padding-top: 20px;
}

.biascolumn {
  display: flex;
  flex-direction: column;
  min-width: 25%;
}

.column {
  display: flex;
  flex-direction: column;
}

.desc {
  margin-left: 20px;
}

.splitter_header {
  margin-top: 10px;
  text-align: center;
}

.small_listbox {
  max-width: 200px;
}

.container {
  display: flex;
  flex-direction: column;
}

[data-type="button"] .formkit-input .cancel {
  background-color: red;
  border-style: dotted;
}

.p-listbox .p-listbox-list .p-listbox-item.p-highlight {
  color: #0445f7;
  background: #b3d1f8;
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

.emptymeasurelist {
  padding: 10px;
}
</style>
