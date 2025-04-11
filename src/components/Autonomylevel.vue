<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/autonomylevels";
import { useDialog } from "primevue/usedialog";
import { useConfirm } from "primevue/useconfirm";
import { ens as systems } from "../lib/stores/systems";

const confirm = useConfirm();
const dialog = useDialog();

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
let createdAt = "";
let updatedAt = "";

const logictypeOptionList = ref([]);
const logictype = ref(0);
const riskOptionList = ref([]);
const risks = ref([]);
const risk_ids = ref([]);
const autonomylevels = ref([]);

let gid = "";
let moduleId = "";

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

  if (params?.moduleId) {
    moduleId = params.moduleId;
    console.log("params.moduleId = " + moduleId);
  }

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
  console.log("load Entity.id: " + id);
  let e = ens.current.filter((e) => e.$id === id)[0];
  console.log("e: ", e);
  editEntity.value = JSON.parse(JSON.stringify(e));

  autonomylevels.value = editEntity.value.autonomylevels;

  console.log("editEntity.value", editEntity.value);
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    level: parseInt(editEntity.value.level),
    title: editEntity.value.title,
    description: editEntity.value.description,
    systemId: editEntity.value.systemId,
    moduleId: moduleId,
  };
  console.log(edit_values);

  if (gid?.length > 0) {
    let u = { ...edit_values, $id: gid };
    ens.update(u);
  } else {
    let a = { ...edit_values, userId: user.current.$id };
    ens.add(a);
  }

  //todo: emit change event, to refresh module
  //reload all ens=autonomylevels
  ens.init();

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
                 name="level"
                 label="Stufe"
                 number="integer"
                 validation=""
                 placeholder="Autonomiestufe Nr."
                 help="" />
        <FormKit type="text"
                 name="title"
                 label="Name"
                 validation="required|not:Admin"
                 placeholder="Autonomiestufen-Name"
                 help="" />

        <FormKit type="textarea"
                 name="description"
                 label="Beschreibung"
                 placeholder="Autonomiestufen-Beschreibung"
                 rows="8"
                 help="" />

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
#logictype_list {
  font-size: smaller;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
