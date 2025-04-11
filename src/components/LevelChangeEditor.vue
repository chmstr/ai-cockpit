<script setup>
import { ref, inject, onMounted } from "vue";
import { user } from "../lib/stores/user";
import { ens as logs } from "../lib/stores/logs";
import { ens as modules } from "../lib/stores/modules";
import { sendPostRequest } from "../lib/shared/utils";
import { format } from "@formkit/tempo";
import {
  ens as autonomylevels,
  getAutonomyLevelsByModuleId,
} from "../lib/stores/autonomylevels";

const props = defineProps({
  id: String,
});
const emit = defineEmits(["onCancel", "onSave"]);
const dialogRef = inject("dialogRef");

const showEditor = ref(true);
let createdAt = "";
let updatedAt = "";
let olevel = -1;
const logmsg = ref("");
const autonomylevel = ref(0);

const editEntity = ref(""); //generic entity name (ens = sein)
let gid = "";
const nlevel = ref(0);

onMounted(() => {
  // console.log("onMounted: props.id = " + props.id);
  let tid = props.id;

  // console.log("-> onMounted: dialogRef = ");
  // console.log(dialogRef);
  const params = dialogRef?.value?.data;
  console.log("params: ", params);
  if (params?.id) {
    tid = params.id;
    //console.log("params.id = " + tid);
  }
  if (params?.newLevel >= 0) {
    nlevel.value = params.newLevel;
    console.log("params.newLevel: ", nlevel.value);
  }

  const id = tid;
  gid = tid;
  console.log("id = " + id);

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  }
});

const levelOptions = ref([]);
let srcEntity;

function getLevelName(level) {
  let levelOption = levelOptions.value.find((i) => i.value === level);
  return levelOption?.title;
}

function loadEntity(id) {
  console.log("id=" + id);
  let e = modules.current.filter((e) => e.$id === id)[0];
  srcEntity = e;
  console.log(e);
  editEntity.value = JSON.parse(JSON.stringify(e));
  //editEntity.value.description = "";
  editEntity.value.logmsg = "";
  olevel = editEntity.value.autonomylevel;
  editEntity.value.autonomylevel = nlevel.value;

  //  editEntity.value.autonomylevels.forEach((al) => {
  getAutonomyLevelsByModuleId(gid).forEach((al) => {
    let levelOption = [];
    levelOption.title = al.title;
    levelOption.value = al.level;
    levelOption.name = al.level + ": " + al.title;
    //levelOption.description = al.description;
    levelOption.disabled = al.level === olevel;
    levelOptions.value.push(levelOption);
  });
  console.log("levelOptions1", levelOptions.value);
  levelOptions.value.sort((a, b) => a.value - b.value);
  console.log("levelOptions2", levelOptions.value);

  createdAt = format(new Date(editEntity.value.$createdAt), {
    date: "medium",
    time: "medium",
  });
  updatedAt = format(new Date(editEntity.value.$updatedAt), {
    date: "medium",
    time: "medium",
  });
}

function changeModulAutonomylevel(apiurl, moduleid, al) {
  console.log("changeModulAutonomylevel.apiurl", apiurl);
  console.log("changeModulAutonomylevel.moduleid", moduleid);
  console.log("changeModulAutonomylevel.autonomylevel", al);
  const reqdata = {
    moduleid: moduleid,
    level: al,
    comment: "dummy comment",
  };
  let resdata = sendPostRequest(apiurl, reqdata);
  console.log(resdata);
}

const formSubmit = (fields) => {
  srcEntity.apiurl =
    "http://www.hypsi.de/dev/kic/api/simulator/autonomylevel.php";

  changeModulAutonomylevel(
    srcEntity.apiurl,
    srcEntity.title,
    editEntity.value.autonomylevel
  );

  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let log_values = {
    action:
      "Modul: " +
      editEntity.value.title +
      ". Changing A-Level from " +
      olevel +
      " to " +
      editEntity.value.autonomylevel,
    description: editEntity.value.logmsg,
  };

  let a = { ...log_values, userId: user.current.$id };
  logs.add(a);

  console.log("log written");
  console.log("-> change a-level to " + nlevel.value);
  console.log(" in DB and change chart");

  let module_values = {
    autonomylevel: editEntity.value.autonomylevel,
  };
  console.log(module_values);

  let u = { ...module_values, $id: gid };
  modules.update(u);

  //todo: emit event, set alevel on chart
  //todo: set alevel in DB

  dialogRef?.value?.close();
};

function cancel() {
  console.log("LevelChanged Canceled");

  dialogRef.value.close();
}
</script>
<template>
  <h2>
    Autonomiestufen-Änderung für:<br />
    Module {{ editEntity.title }}
  </h2>
  <h3>{{ editEntity.description }}</h3>
  <FormKit
    type="form"
    @submit="formSubmit"
    submit-label="Save"
    #default="{ value }"
    prefix-icon="check"
    v-model="editEntity"
  >
    <div class="row">
      <div class="column">
        Bisher:
        <Listbox
          disabled
          v-model="olevel"
          :options="levelOptions"
          optionLabel="name"
          optionValue="value"
        />
        <h1 class="level">{{ olevel }}: {{ getLevelName(olevel) }}</h1>
      </div>
      <div class="column">
        Neu:
        <Listbox
          v-model="editEntity.autonomylevel"
          :options="levelOptions"
          optionLabel="name"
          optionValue="value"
          option-disabled="disabled"
        />
        <h1 class="level">
          {{ editEntity.autonomylevel }}:
          {{ getLevelName(editEntity.autonomylevel) }}
        </h1>
      </div>

      <!-- <FormKit
      type="text"
      name="autonomylevel"
      label="Neuer Autonomie-Level"
      validation="required|not:Admin"
      placeholder="Neuer Autonomie-Level"
      help=""
    /> -->
    </div>

    <!-- validation="required|not:Admin" -->

    <FormKit
      type="textarea"
      name="logmsg"
      label="Begründung"
      help=""
      placeholder="Begründung der Änderung"
    />
    <Button type="button" @click="cancel()" severity="danger" outlined
      >Cancel</Button
    >
  </FormKit>
</template>
<style scoped>
.level {
  text-align: center;
}
.row {
  display: flex;
}

.column {
  flex: 50%;
}
</style>
