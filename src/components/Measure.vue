<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/measures";
import { ens as systems } from "../lib/stores/systems";
import { format, parse } from "@formkit/tempo";

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
let createdAt = "";
let updatedAt = "";

let gid = "";

const dialogRef = inject("dialogRef");

onMounted(() => {
  let tid = props.id;
  const params = dialogRef?.value?.data;
  if (params?.id) {
    tid = params.id;
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
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    description: editEntity.value.description,
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
                 label="Bezeichnung"
                 validation="required|not:Admin"
                 placeholder="Bezeichnung der Maßnahme"
                 help="" />

        <TabView>
          <TabPanel header="Basics">
            <FormKit type="textarea"
                     name="description"
                     label="Beschreibung"
                     placeholder="Beschreibung der Maßnahme"
                     help="" />
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
