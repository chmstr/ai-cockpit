<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/systems";
import TabPanel from "primevue/tabpanel";

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
  console.log("systemcomponent.props.systemId: ", tid);
  const params = dialogRef?.value?.data;
  if (params?.id) {
    tid = params.id;
    console.log("systemcomponent.params.systemId: ", tid);
  }
  const id = tid;
  gid = tid;
  console.log("systemcomponent.final.systemId: " + id);

  showEditor.value = true;
  if (id?.length > 0) {
    loadEntity(id);
  } else {
    isNew.value = true;
    showEditor.value = true;
  }
});

function loadEntity(id) {
  console.log("systemcomponent.loadEntity.id: ", id);
  let e = ens.current.filter((e) => e.$id === id)[0];
  console.log("systemcomponent.entity: ", e);
  editEntity.value = JSON.parse(JSON.stringify(e));
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
    seq: editEntity.value.seq,
    editors: editEntity.value.editors,
    viewers: editEntity.value.viewers,
    alarm_email: editEntity.value.alarm_email,
    demomode: editEntity.value.demomode,
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
      >
        <FormKit
          type="text"
          name="title"
          label="Bezeichnung"
          validation="required|not:Admin"
          placeholder="Name des Systems"
          help=""
          :config="{ disabled: !canEdit }"
        />
        <TabView>
          <TabPanel header="Basics">
            <FormKit
              type="textarea"
              name="description"
              label="Beschreibung"
              placeholder="Beschreibung des Systems"
              help=""
            />
          </TabPanel>

          <TabPanel header="Zugriff">
            <FormKit
              type="textarea"
              name="editors"
              label="Liste der Editoren"
              placeholder="Komma-separierte Liste aller E-Mails der Editoren"
              help="Komma-separierte Liste aller E-Mails der Editoren"
            />
            <FormKit
              type="textarea"
              name="viewers"
              label="Liste der Benutzer nur mir Lesezugriff"
              placeholder="Komma-separierte Liste aller E-Mails der Lesezugriff-User"
              help="Komma-separierte Liste aller E-Mails der Lesezugriff-User"
            />
          </TabPanel>
          <TabPanel header="Konfiguration">
            <FormKit
              type="text"
              name="alarm_email"
              label="Alarmierungs-Mail"
              placeholder="E-Mail-Adresse für Alarmierungsbenachrichtigungen"
              help="E-Mail-Adresse für Alarmierungsbenachrichtigungen"
            />
            <FormKit
              type="text"
              name="demomode"
              label="Demo-Modus"
              number="integer"
              placeholder="0 oder 1"
              help="1 = demomode aktiv. 0 = livemode aktiv, d.h. echte API Requests"
            />
            <FormKit
              type="text"
              name="seq"
              label="Prio"
              number="integer"
              placeholder="Sortierreihenfolge (hohe Prio = hohe Zahl)"
              help=""
            />
            <FormKit
              type="text"
              name="systemId"
              label="System-ID"
              number="integer"
              validation="required|not:Admin"
              placeholder="ID des Systems"
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
        >
          Cancel</Button
        >
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
