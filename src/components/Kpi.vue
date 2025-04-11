<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/kpis";
import { ens as systems } from "../lib/stores/systems";
import {
  KPI_CHARTDISPLAYMODE_OPTIONS,
  KPI_CHARTTYPE_OPTIONS,
} from "../lib/shared/dropdowns.js";
import { format } from "@formkit/tempo";
import { ens as moduleList } from "../lib/stores/modules";

const props = defineProps({
  id: String,
});

const editEntity = ref("");
const isNew = ref(false);
const showEditor = ref(true);
const dialogRef = inject("dialogRef");
const chartdisplaymode = ref(0);
const charttype = ref("");
const moduleOptionList = ref([]);
const modules = ref([]);
const modules_ids = ref([]);

let createdAt = "";
let updatedAt = "";
let gid = "";
let c = 0;

onMounted(() => {
  let tid = props.id;
  c++;
  //console.log("c = " + c);

  const params = dialogRef?.value?.data;
  if (params?.id) {
    tid = params.id;
  }
  const id = tid;
  gid = tid;
  console.log(`id x= ${id}`);

  moduleOptionList.value = moduleList.option_list;

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
  chartdisplaymode.value = editEntity.value.chartdisplaymode;
  charttype.value = editEntity.value.charttype;

  modules.value = editEntity.value.modules;
  editEntity.value.modules.forEach((m) => {
    modules_ids.value.push(m.$id);
  });

  createdAt = format(new Date(editEntity.value.$createdAt), {
    date: "medium",
    time: "medium",
  });
  updatedAt = format(new Date(editEntity.value.$updatedAt), {
    date: "medium",
    time: "medium",
  });
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const formSubmit = (fields) => {
  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    description: editEntity.value.description,
    url: editEntity.value.url,
    min: editEntity.value.min,
    max: editEntity.value.max,
    chartdisplaymode: chartdisplaymode.value,
    charttype: charttype.value,
    chartseq: editEntity.value.chartseq,
    config: editEntity.value.config,
    chartdata: editEntity.value.chartdata,
    modules: modules_ids.value,
    systemId: editEntity.value.systemId,
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

const loading = ref("");
const logmsg = ref("");
const res_status = ref("");
const res_data = ref("");
const res_json = ref("");

async function updateKpis() {
  await sendKpiRequest();
  let u = { chartdata: editEntity.value.chartdata, $id: gid };
  ens.update(u);
}

async function sendKpiRequest() {
  loading.value = true;
  let url = editEntity.value.url;

  console.log("url: ", url);

  await fetch(url, {
    method: "GET",
    headers: {},
    //    mode: 'cors'
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("data: ", data);
      res_json.value = data;
      res_data.value = data;
      editEntity.value.chartdata = JSON.stringify(data);
    })
    .catch((err) => {
      logmsg.value += "|ERROR response: " + err;
      res_status.value = err.status;
      console.error(err);
    });

  loading.value = false;
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
        <FormKit type="text"
                 name="title"
                 label="Name"
                 validation="required|not:Admin"
                 placeholder="KPI-Name"
                 help="" />

        <TabView>
          <TabPanel header="Basics">
            <div class="row">
              <FormKit type="textarea"
                       name="description"
                       label="Beschreibung"
                       placeholder="KPI-Beschreibung"
                       help=""
                       cols="30"
                       rows="15" />

              <div class="column">
                <div for="modules"
                     class="label">KPI für Module:</div>
                <Listbox id="modules"
                         v-model="modules_ids"
                         :options="moduleOptionList"
                         multiple
                         option-label="label"
                         option-value="value"
                         class="moduleclass" />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Grenzwerte">
            <FormKit type="text"
                     name="min"
                     label="Minimum Value"
                     number="integer"
                     placeholder=""
                     help="" />
            <FormKit type="text"
                     name="max"
                     label="Maximum Value"
                     number="integer"
                     placeholder=""
                     help="" />
          </TabPanel>
          <TabPanel header="Chart-Config">
            <Listbox v-model="chartdisplaymode"
                     :options="KPI_CHARTDISPLAYMODE_OPTIONS"
                     optionLabel="label"
                     optionValue="value"
                     placeholder="Chart Display Mode"
                     style="margin-bottom: 20px" />

            Chart-Typ:
            <Dropdown v-model="charttype"
                      :options="KPI_CHARTTYPE_OPTIONS"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Chart Type"
                      class="w-full md:w-14rem" />

            <FormKit type="number"
                     number="integer"
                     name="chartseq"
                     label="Chart Prio"
                     placeholder="Chart Prio"
                     help="Je höher, desto weiter oben wird es angezeigt" />

            <FormKit type="text"
                     name="url"
                     label="URL"
                     placeholder="KPI-URL"
                     help="" />

            <Button class="test-button"
                    type="button"
                    @click="sendKpiRequest()"
                    severity="danger"
                    outlined>Test KPI-URL</Button>
            <Button class="test-button"
                    type="button"
                    @click="updateKpis()"
                    severity="danger"
                    outlined>Test & Update KPIs</Button>
            <p>JSON:</p>
            <textarea cols="50"
                      rows="10">{{ res_json }}</textarea>

            <FormKit type="textarea"
                     rows="5"
                     cols="20"
                     name="chartdata"
                     label="Chart-Data"
                     placeholder="Chart-Data"
                     help=""
                     wrapper-class="config"
                     outer-class="config"
                     id="dconfig" />

            <FormKit name="config"
                     type="textarea"
                     rows="5"
                     cols="20"
                     label="Chart-Options"
                     placeholder="Chart-Options"
                     help=""
                     wrapper-class="config"
                     outer-class="config"
                     id="config" />
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
.label {
  display: inline-flex;
}

.moduleclass {
  margin: 20px;
}

.row {
  display: flex;
  flex-direction: row;
}

.container {
  display: flex;
  flex-direction: column;
}

[data-type="button"] .formkit-input .cancel {
  background-color: red;
  border-style: dotted;
}
</style>
