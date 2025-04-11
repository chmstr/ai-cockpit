<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { user } from "../lib/stores/user";
import { ens } from "../lib/stores/riskpool";
import { ens as systems } from "../lib/stores/systems";

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const srcEntity = ref("");
const isNew = ref(false);
const showEditor = ref(true);

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
    console.log("systems.systemId: " + systems.systemId);
    console.log("editEntity systemID set?: ", editEntity.value);
  }
});

function loadEntity(id) {
  let e = ens.list.filter((e) => e.$id === id)[0];
  srcEntity.value = e;
  editEntity.value = JSON.parse(JSON.stringify(e));

  //console.log("modules_ids: ", modules_ids);
  //console.log("editEntity.value", editEntity.value);
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
    name: editEntity.value.name,
    description: editEntity.value.description,
    systemId: editEntity.value.systemId,
    source: editEntity.value.source,
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
        :submit-attrs="{
          inputClass: 'unused',
          wrapperClass: 'save-wrapper',
          outerClass: 'save-outer',
          ignore: false,
        }"
      >
        <FormKit
          type="text"
          name="title"
          validation="required|not:Admin"
          label="Name (kurz)"
          placeholder="Kurzer Risiko-Name"
          help=""
        />

        <FormKit
          type="textarea"
          name="name"
          label="Name (lang)"
          rows="2"
          placeholder="Langer Risiko-Name"
          help=""
        />

        <TabView>
          <TabPanel header="Basics">
            <FormKit
              type="textarea"
              name="description"
              label="Beschreibung"
              rows="15"
              placeholder="Risiko-Beschreibung"
              help=""
            />

            <FormKit
              type="text"
              name="source"
              label="Quelle"
              placeholder="Risiko-Quelle"
              help=""
            />
          </TabPanel>
          <TabPanel header="Admin">
            <EditorAdmin :e="editEntity" />
          </TabPanel>
        </TabView>
        <Button
          class="cancel-button"
          type="button"
          @click="cancel()"
          severity="danger"
          outlined
          >Cancel</Button
        >
      </FormKit>
    </div>
  </section>
  <section v-else>
    <p>Please login to create an entity.</p>
  </section>
</template>

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
