<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens as logs } from "../lib/stores/logs";
import { ens as modules } from "../lib/stores/modules";
import { ens as systems } from "../lib/stores/systems";
import { sendPostRequest, sendPatchRequest } from "../lib/shared/utils";
import { format } from "@formkit/tempo";

const props = defineProps({});
const emit = defineEmits(["onCancel", "onSave"]);
const dialogRef = inject("dialogRef");
const editEntity = ref(""); //generic entity name (ens = sein)

onMounted(() => {});

function log(act, desc) {
  let log_values = {
    action: act,
    description: desc,
  };
  let a = { ...log_values, userId: user.current.$id };
  logs.add(a);
}

const formSubmit = (fields) => {
  let logaction = "";
  let demomode = systems.system.demomode;
  //demomode = 0: live
  //demomode = 1: fake
  //demomode = 2: fake + request
  console.log("demomode: ", demomode);
  let logmsg = "Stopptaste gedrückt";

  //logging before
  log(logmsg, editEntity.value.description);

  if (demomode) {
    console.log("demomode: active");
  }

  modules.current.forEach((module) => {
    if (demomode == 0 || demomode == 2) {
      console.log("demomode 0 or 2: send requests");
      let api_url = module.apiurl_al_active;
      // if (!api_url) api_url = module.apiurl + "/autonomy-levels/active";
      // if (!api_url)
      //   api_url =
      //     systems.system.base_url +
      //     "/modules/" +
      //     module.$id +
      //     "/autonomy-level/active";
      console.log("apiurl: " + api_url);

      let sendRequest = true;
      if (!api_url) sendRequest = false;

      if (sendRequest) {
        try {
          console.log("sendrequest");
          let res = sendPatchRequest(api_url, module.stoplevel);
          console.log("result: ", res);
        } catch (e) {
          console.error(e);
        }
        console.log("request sent");
      }
    }

    let ustr = {
      $id: module.$id,
      autonomylevel: module.stoplevel,
    };
    modules.update(ustr);
  });

  //todo: emit event, set alevel on chart
  //todo: set alevel in DB

  dialogRef?.value?.close();
};

function getLevelChangeInfo(al, sl) {
  let res = "";
  if (al == sl) res = "";
  else res = "(Änderung!)";
  return res;
}

function cancel() {
  dialogRef.value.close();
}
</script>
<template>
  Die Ausführung der Stopptaste führt zu einer Änderung der Autonomiesstufen
  folgender Module:

  <DataTable
    :value="modules.current"
    dataKey="$id"
    tableClass="listtable"
    showGridlines
    stripedRows
    :rows="10"
    sortField="title"
    :sortOrder="+1"
  >
    <Column
      field="title"
      header="Modul-Name"
      style="vertical-align: text-top"
      sortable
    ></Column>

    <Column header="Autonomistufen-Änderung" style="vertical-align: text-top">
      <template #body="{ data }">
        {{ data.autonomylevel }} -> {{ data.stoplevel }}
        <b>{{ getLevelChangeInfo(data.autonomylevel, data.stoplevel) }}</b>
      </template>
    </Column>
  </DataTable>

  <div class="row"></div>
  <br />
  <FormKit
    type="form"
    @submit="formSubmit"
    submit-label="KI-Stopp Taste ausführen!"
    #default="{ value }"
    prefix-icon="check"
    v-model="editEntity"
    :submit-attrs="{
      id: 'stop-button',
      inputClass: 'stop-input',
      wrapperClass: 'stop-wrapper',
      outerClass: 'stop-outer',
      ignore: false,
    }"
    :config="{ disabled: !canEdit }"
  >
    <!-- validation="required|not:Admin" -->

    <FormKit
      type="textarea"
      name="description"
      label="Begründung"
      help=""
      placeholder="Begründung der Änderung"
      validation="required|not:Admin"
    />

    <Button
      style="margin-bottom: 20px"
      type="button"
      @click="cancel()"
      severity="danger"
      outlined
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
<style>
#stop-button {
  background-color: #ea443c;
  border: 4px solid #cc0000;
  /* Dunklerer roter Rand für Definition */
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.3);
  /* Leichter Schatten für Hervorhebung */
  cursor: pointer;
  /* Mauszeiger als Hand, um Interaktivität anzuzeigen */
  transition: background-color 0.3s ease;
  /* Sanfte Übergang für Hover-Effekt */
}

#stop-button:hover {
  background-color: #e60000;
  /* Noch dunkleres Rot beim Überfahren */
  border-color: #990000;
  /* Dunklerer Rand beim Überfahren */
}

[data-type="submit"] .stop-input {
  background-color: #ea443c;
  border-radius: 50px;
  padding: 50px;
  font-weight: bolder;
  font-size: x-large;
}

[data-type="submit"] .stop-input :hover {
  background-color: #ef4444;
  border-radius: 10px;
  padding: 50px;
  font-weight: bolder;
  font-size: x-large;
}
</style>
