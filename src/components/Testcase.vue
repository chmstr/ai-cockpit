<script setup>
import { ref, inject, onMounted } from "vue";
import { user, canEdit } from "../lib/stores/user";
import { ens } from "../lib/stores/testcases";
import { ens as systems } from "../lib/stores/systems";
import { ens as testexecutions } from "../lib/stores/testexecutions";
import {
  TESTCASE_TECTYPE_OPTIONS,
  TESTCASE_PYTYPE_OPTIONS,
  TESTCASE_BIASTYPE_OPTIONS,
  getTestcaseTectypeDesc,
  getTestcasePytypeDesc,
} from "../lib/shared/dropdowns";
import { format } from "@formkit/tempo";

const props = defineProps({
  id: String,
});

const editEntity = ref(""); //generic entity name (ens = sein)
const isNew = ref(false);
const showEditor = ref(true);
const biastype = ref();
const testtext = ref("");
const testurl = ref("testurl");
const testresponse = ref("- empty -");
const res_data = ref();
const res_status = ref("");
const checkstatus = ref(0);
const scripterror = ref("");
const testlog = ref("");
//const testexecutions = ref([]);

let gid = "";
const logmsg = ref("");

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
    testexecutions.init(gid); //only testexecs of this testcase-id
  } else {
    isNew.value = true;
    showEditor.value = true;
    editEntity.value.systemId = systems.systemId;
  }
});

function loadEntity(id) {
  let e = ens.current.filter((e) => e.$id === id)[0];
  console.log("entity: ", e);
  editEntity.value = JSON.parse(JSON.stringify(e));
  console.log("editEntity: ", editEntity.value);
  testtext.value = editEntity.description; //**?? */
}

function cancel() {
  showEditor.value = false;
  dialogRef.value.close();
}

const loading = ref(false);

async function execute() {
  testlog.value = "start executing";
  logmsg.value = "start executing";

  let execstatus = 1; //executed

  let testexec = {
    userId: user.current.$id,
    execstatus: execstatus,
    testcases: gid,
  };

  let txid = 0;

  await testexecutions.add(testexec).then(
    function (value) {
      txid = value; //docid of testexec
      execstatus = 2; //after successfull insertion
      //console.log("1: async return value : ", txid)
    },
    function (error) {
      execstatus = -1; //after error insertion
      console.log("error: ", error);
    }
  );
  //console.log("2: sync return value: ", txid)
  testlog.value = "first entry written";
  logmsg.value += "|1. initial entry written";

  logmsg.value += "|2. try to send request";
  await sendTestRequest();
  logmsg.value += "|3. sending request done.";
  execstatus = 3; //response received

  logmsg.value += "|4. try to check response data.";
  await check();
  logmsg.value += "|5. checking response data over.";
  execstatus = 5; //check done

  testexec = {
    $id: txid,
    resultstatus: checkstatus.value,
    execstatus: execstatus,
    log: logmsg.value,
  };
  testexecutions.update(testexec);

  //resultstatus: 0=not started, 1=failed, 2=erfolg
  //execstatus: 5=done
}

async function sendTestRequest() {
  testlog.value = "start sending request";
  loading.value = true;
  let url = editEntity.value.apiurl;
  //url = "http://localhost:3000/test.json";
  //url = "http://hypsi.de/dev/kic/api/corstest.php";
  //url = "http://hypsi.de/dev/kic/endpointsimulator/api.php?id=1";

  console.log("sendTestRequest0.1");
  let bodystr = JSON.stringify(editEntity.value.apipayload);
  console.log("sendTestRequest0.2");

  await fetch(url, {
    method: "POST",
    body: bodystr,
    headers: {},
    //    mode: 'cors'
  })
    .then(async (response) => {
      testlog.value = "successfull got response";
      logmsg.value += "|5.1 got response";
      console.log("sendTestRequest1 ");
      //console.log(response);
      //console.log(...response.headers)
      res_status.value = response.status;

      //let data = await response.json();

      await resolveTestResponse(response);
      logmsg.value += "|5.2 resolved response";

      console.log("sendTestRequest3");
    })
    .catch((err) => {
      testlog.value = "error response";
      logmsg.value += "|ERROR response: " + err;

      res_status.value = err.status;
      console.error(err);
      testresponse.value = err;
    });

  console.log("sendTestRequest4: ", testresponse.value);
  loading.value = false;
}

async function resolveTestResponse(response) {
  await response.json().then((data) => {
    res_data.value = data;
    testresponse.value = JSON.stringify(data, undefined, 2);
    console.log("sendTestRequest2: ", testresponse.value);
  });
}

async function check() {
  testlog.value = "start testresult check";
  checkstatus.value = 0;
  let d = res_data.value;
  //console.log("checkscript: ", editEntity.value.checkscript);
  let checkok = false; //eval(editEntity.value.checkscript);
  try {
    console.log("-> d_foreval: " + d);
    checkok = eval(editEntity.value.checkscript);

    if (checkok) {
      console.log("success");
      checkstatus.value = 2;
      testlog.value = "Test OK! :-)";
      logmsg.value += "|checking response successfull";
    } else {
      console.log("error");
      checkstatus.value = 1;
      testlog.value = "Test failed... :-(";
      logmsg.value += "|ERROR checking response";
    }
  } catch (e) {
    //alert(e.message);
    checkstatus.value = -1;
    scripterror.value = e.message;
    logmsg.value += "|CATCH-ERROR checking response";

    if (e instanceof SyntaxError) {
      console.log("SyntaxError", e);
      testlog.value = "Test ERROR_3!";
    } else {
      testlog.value = "Test ERROR_4";
      console.log("OtherError", e);
      //throw e;
    }
  }
}

const formSubmit = (fields) => {
  let logaction = "";

  //einzige stelle (neben dem template), wo das Mapping der Felder passiert
  let edit_values = {
    title: editEntity.value.title,
    description: editEntity.value.description,
    tectype: editEntity.value.tectype,
    pytype: editEntity.value.pytype,
    apiurl: editEntity.value.apiurl,
    apipayload: editEntity.value.apipayload,
    checkscript: editEntity.value.checkscript,
    systemId: editEntity.value.systemId,
  };

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

function formatDate(date) {
  return format(new Date(date), { date: "medium", time: "medium" });
}
</script>

<template>
  <section v-if="user.current">
    <div v-if="showEditor"
         class="xcontainer">
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
                 help=""
                 placeholder="Testfall Name" />
        <TabView>
          <TabPanel v-if="true"
                    header="Basic">
            <!--<Editor v-model="testtext"
                                editorStyle="height: 220px" />-->
            <FormKit type="textarea"
                     name="description"
                     label="Beschreibung"
                     validation="required|not:Admin"
                     help="Beschreibung des Testfalls"
                     cols="20"
                     rows="15"
                     placeholder="Testfall Beschreibung" />
          </TabPanel>
          <TabPanel v-if="true"
                    header="Typ">
            <div class="column">
              <div class="labelrow">
                <label class="label"
                       for="tectype">Test-Art:</label>
              </div>
              <div class="row">
                <Listbox id="tectype"
                         placeholder="Tech-Type"
                         v-model="editEntity.tectype"
                         optionValue="value"
                         optionLabel="label"
                         checkmark
                         class="dropdown"
                         :options="TESTCASE_TECTYPE_OPTIONS">
                </Listbox>
                <div class="desc"
                     v-html="getTestcaseTectypeDesc(editEntity?.tectype)" />
              </div>

              <div class="labelrow">
                <label class="label"
                       for="pytype">Pyramiden-Typ:</label>
              </div>
              <div class="row">
                <Listbox placeholder="Pyramiden-Typ"
                         v-model="editEntity.pytype"
                         optionValue="value"
                         optionLabel="label"
                         checkmark
                         class="dropdown"
                         :options="TESTCASE_PYTYPE_OPTIONS"></Listbox>
                <div class="desc"
                     v-html="getTestcasePytypeDesc(editEntity?.pytype)" />
                <!-- <img src="@/assets/pytest.png" /> -->
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Test-Config">
            <div class="urlrow">
              <FormKit id="apiurl"
                       type="text"
                       label="Endpoint URL"
                       name="apiurl"
                       validation=""
                       help=""
                       placeholder="Test-URL"
                       :outer-class="{
                        apiurlouter: true,
                        'formkit-outer': false,
                      }" />
              <Button id="testbutton"
                      class="test-button"
                      type="button"
                      :loading="loading"
                      @click="sendTestRequest"
                      severity="warning">
                Ausführen</Button>
            </div>
            <div class="row2">
              <div class="column2">
                <FormKit type="textarea"
                         label="Payload-Content"
                         name="apipayload"
                         validation=""
                         help="Payload"
                         placeholder="Payload in Body of the Test-POST-Request" />
                <FormKit type="file"
                         label="Test-Daten"
                         accept=".csv,.json,.yaml"
                         help="Erlaubte Format: .csv /.json/ .yaml"
                         multiple="true" />
              </div>
              <div class="column">
                <label for="testresponse">Response-Status: {{ res_status }} / JSON:</label>
                <Textarea id="testresponse"
                          v-model="testresponse"
                          cols="40"
                          rows="12"></Textarea>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Check-Logic">
            <FormKit type="textarea"
                     label="Check-Script"
                     name="checkscript"
                     validation=""
                     help="use 'd' as variable for the response data object"
                     placeholder="" />
            <Button id="checkbutton"
                    class="check-button"
                    type="button"
                    :loading="loading"
                    @click="check"
                    severity="warning">
              Ausführen</Button>

            <div class="checkstatus darkred"
                 v-if="checkstatus == -1">
              SCRIPT ERROR<br />{{ scripterror }}
            </div>
            <div class="checkstatus grey"
                 v-if="checkstatus == 0">---</div>
            <div class="checkstatus red"
                 v-if="checkstatus == 1">
              CHECK FAILED
            </div>
            <div class="checkstatus green"
                 v-if="checkstatus == 2">
              CHECK OK
            </div>
          </TabPanel>
          <TabPanel header="Executions">
            <Button id="execbutton"
                    class="exec-button"
                    type="button"
                    :loading="loading"
                    @click="execute"
                    severity="warning">
              Testcase ausführen</Button>
            {{ testlog }}

            <DataTable :value="testexecutions.current"
                       dataKey="$id"
                       showGridlines
                       stripedRows
                       paginator
                       :rows="5"
                       :rowsPerPageOptions="[5, 10, 20, 50]"
                       sortField="$updatedAt"
                       :sortOrder="-1"
                       tableStyle="">
              <Column field="$createdAt"
                      header="Datum"
                      sortable>
                <template #body="{ data }">
                  {{ formatDate(data.$updatedAt) }}
                </template>
              </Column>
              <Column field="log"
                      header="Log"
                      sortable></Column>
              <Column field="resultstatus"
                      header="Result-Status"
                      sortable>
                <template #body="{ data }"
                          class="teststatus">
                  <div v-if="data.resultstatus == 0"
                       class="teststatus grey"></div>
                  <div v-if="data.resultstatus == 1"
                       class="teststatus red">
                    FEHLER
                  </div>
                  <div v-if="data.resultstatus == -1"
                       class="teststatus red">
                    FEHLER
                  </div>
                  <div v-if="data.resultstatus == 2"
                       class="teststatus green">
                    OK
                  </div>
                </template>
              </Column>
            </DataTable>
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
.checkstatus {
  padding: 10px;
  margin: 10px;
  max-width: 50%;
}

.teststatus {
  background-color: #dddddd;
  text-align: center;
  min-height: 60px;
  vertical-align: middle;
  color: white;
  display: display-box;
}

.green {
  background-color: green;
}

.grey {
  background-color: grey;
}

.red {
  background-color: red;
}

.darkred {
  background-color: rgb(255, 0, 204);
}

.urlrow {
  max-width: 100%;
}

.testbutton {
  width: 20%;
}

.apiurlouter {
  width: 80%;
  display: inline-block;
}

#testbutton {
  color: white;
}

.row2 {
  display: flex;
  padding-top: 20px;
}

.column2 {
  width: 40%;
  padding: 10px;
}

.container {
  display: flex;
  flex-direction: column;
}

.column {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.labelrow {
  display: flex;
  padding-top: 20px;
  padding-bottom: 5px;
}

.label {
  margin-right: 20px;
  display: block;
}

.dropdown {
  margin-bottom: 10px;
  min-width: 200px;
}

.desc {
  margin-left: 20px;
  font-size: smaller;
  max-width: 30%;
}

[data-type="button"] .formkit-input .cancel {
  background-color: red;
  border-style: dotted;
}
</style>
