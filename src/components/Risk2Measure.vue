<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens as risks2all } from "../lib/stores/risks2all";
import { ens as measureList } from "../lib/stores/measures";
import { ens as riskList } from "../lib/stores/risks";
import { ens as testcaseList } from "../lib/stores/testcases";
import { ens as kpiList } from "../lib/stores/kpis";
import { ens as ruleList } from "../lib/stores/rules";
import { format } from "@formkit/tempo";

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
const riskid = ref();
const riskname = ref();
const type = ref();
const measureid = ref();
let createdAt = "";
let updatedAt = "";
const measure_options = ref([]);
const risk_options = ref([]);
const type_options = ref([
  {
    name: "is monitored by",
    value: "monitored",
  },
  {
    name: "is reduced by",
    value: "reduced",
  },
  {
    name: "is eliminated by",
    value: "eliminated",
  },
]);

let gid = "";
let collectionId = "";

const dialogRef = inject("dialogRef");

onMounted(() => {
  console.log("start risk2measure mounted");
  let tid = props.id;
  const params = dialogRef?.value?.data;
  if (params?.id) {
    tid = params.id;
    console.log("params.id: " + tid);
    collectionId = params.collectionId;
    console.log("collectionId: " + collectionId);
  }
  const id = tid;
  gid = tid;
  console.log("id = " + id);

  //prepare select options (for save AND update)
  for (const e of riskList.current) {
    let a = {};
    a.title = e.title;
    a.value = e.$id;
    risk_options.value.push(a);
  }

  for (const e of measureList.current) {
    let a = {};
    a.title = "Maßnahme: " + e.title;
    a.value = e.$id;
    a.entity = "measure";
    measure_options.value.push(a);
  }

  for (const e of testcaseList.current) {
    let a = {};
    a.title = "Testcase: " + e.title;
    a.value = e.$id;
    a.entity = "testcase";
    measure_options.value.push(a);
    //console.log("added testcase: ", a);
  }

  for (const e of kpiList.current) {
    let a = {};
    a.title = "KPI: " + e.title;
    a.value = e.$id;
    a.entity = "kpi";
    measure_options.value.push(a);
    //console.log("added kpi: ", a);
  }

  for (const e of ruleList.current) {
    let a = {};
    a.title = "Rule: " + e.title;
    a.value = e.$id;
    a.entity = "rule";
    measure_options.value.push(a);
  }

  //console.log(measure_options.value);
  //console.log(risk_options.value);

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
  }
});

function loadEntity(id) {
  let e = {};
  e = risks2all.current.filter((e) => e.$id === id)[0];
  console.log("-- loadedEntity", e);

  editEntity.value = JSON.parse(JSON.stringify(e));
  //console.log("-- editEntity: ", editEntity.value);

  riskname.value = editEntity.value.risk.title;
  riskid.value = editEntity.value.risk.$id;

  type.value = editEntity.value.type;

  if (collectionId == "risk2measure") {
    measureid.value = editEntity.value.measure.$id;
  } else if (collectionId == "risks2kpis") {
    measureid.value = editEntity.value.kpi.$id;
  } else if (collectionId == "risks2rules") {
    measureid.value = editEntity.value.rule.$id;
  } else if (collectionId == "risks2testcases") {
    measureid.value = editEntity.value.testcase.$id;
  } else console.log("oh no, couldt not load ... ", collectionId);

  console.log("mapped measure.id: " + measureid.value);

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

const save = () => {
  let selentry = measure_options.value.find(
    (entry) => entry.value === measureid.value
  );
  console.log("found selentry: ", selentry);
  let seltype = selentry.entity;
  let selid = measureid.value;

  if (gid?.length > 0) {
    risks2all.remove(editEntity.value); //delete old editentry
  }

  //save/add
  let a = { risk: riskid.value, type: type.value, userId: user.current.$id };

  console.log("try to add new entry");

  if (seltype == "measure") {
    a.measure = selid;
    console.log("risk2measure.add", a);
  } else if (seltype == "kpi") {
    a.kpi = selid;
    console.log("risk2kpis.add", a);
  } else if (seltype == "rule") {
    a.rule = selid;
    console.log("risk2rules.add", a);
  } else if (seltype == "testcase") {
    a.testcase = selid;
    console.log("risk2testcase.add", a);
  } else console.log("oh no, forget to save type ... ", seltype);

  console.log("risks2all.add pre-length: " + risks2all.current.length);
  console.log("risks2all.add: ", a);
  risks2all.add(a, seltype); //refreshing list
  console.log("risks2all.add post-length: " + risks2all.current.length);

  showEditor.value = false;
  dialogRef?.value?.close();
};
</script>

<template>
  <section v-if="user.current">
    <div v-if="showEditor"
         class="container">
      <label for="risk">Risiko-Name</label>
      <Dropdown id="risk"
                v-model="riskid"
                :options="risk_options"
                optionLabel="title"
                optionValue="value"
                :disabled="!isNew"
                placeholder="Select a Risk" />

      <Splitter style="min-height: 550px"
                class="mb-5">
        <SplitterPanel :size="25"
                       :minSize="10"
                       class="flex align-items-center justify-content-center">
          <Listbox id="type"
                   v-model="type"
                   :options="type_options"
                   optionLabel="name"
                   optionValue="value"
                   placeholder="Select a Type" />
          <Button type="button"
                  @click="save()"
                  label="Save"
                  class="kic-button"
                  id="kic-risk2measure-save"></Button>
          <Button type="button"
                  @click="cancel()"
                  severity="danger"
                  outlined>Cancel</Button>
        </SplitterPanel>
        <SplitterPanel :size="75"
                       class="flex align-items-center justify-content-center">
          <ScrollPanel style="width: 100%; height: 550px">
            <Listbox id="measure"
                     v-model="measureid"
                     :options="measure_options"
                     optionLabel="title"
                     optionValue="value"
                     placeholder="Select a Measure" />
          </ScrollPanel>
        </SplitterPanel>
      </Splitter>

      <!-- <div v-if="!isNew"
           class="displayelement">Created: {{ createdAt }}</div>
      <div v-if="!isNew"
           class="displayelement">Updated: {{ updatedAt }}</div>
      <div v-if="!isNew"
           class="displayelement">
        SID: {{ editEntity?.systemId }}
      </div> -->
    </div>
  </section>
  <section v-else>
    <p>Please login to create an entity.</p>
  </section>
</template>
<style></style>

<style scoped>
#kic-risk2measure-save {
  background: #004b70;
  border: none;
  font-size: medium;
}


#risk,
#type,
#measure {
  margin-bottom: 20px;
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
