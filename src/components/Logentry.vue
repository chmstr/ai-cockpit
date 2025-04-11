<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/logs";
import { format, parse } from "@formkit/tempo";

const props = defineProps({
  id: String,
});

const en_name = "LogEntry";
const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
let createdAt = "";
let updatedAt = "";

const emit = defineEmits(["onCancel", "onSave"]);
let gid = "";

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

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
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
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    action: editEntity.value.action,
    description: editEntity.value.description,
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
</script>

<template>
  <section v-if="user.current">
    <div v-if="showEditor" class="container">
      <FormKit
        type="form"
        @submit="formSubmit"
        submit-label="Save"
        #default="{ value }"
        prefix-icon="check"
        v-model="editEntity"
        :config="{ disabled: !canEdit }"
      >
        <FormKit
          type="text"
          name="action"
          label="Aktion"
          validation="required|not:Admin"
          placeholder="Aktions-Name"
          :disabled="!isNew"
          help=""
        />
        <FormKit
          type="textarea"
          name="description"
          label="Beschreibung"
          placeholder="Beschreibungstext"
          :disabled="!isNew"
          help=""
        />
        <div v-if="!isNew" class="displayelement">Created: {{ createdAt }}</div>
        <div v-if="!isNew" class="displayelement">Updated: {{ updatedAt }}</div>
      </FormKit>
      <Button type="button" @click="cancel()" severity="danger" outlined
        >Cancel</Button
      >
    </div>
  </section>
  <section v-else>
    <p>Please login to create an entity.</p>
  </section>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

[data-type="button"] .formkit-input .cancel {
  background-color: red;
  border-style: dotted;
}
</style>
