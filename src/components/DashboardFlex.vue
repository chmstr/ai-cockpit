<script setup>
import { onMounted, ref, computed } from "vue";
import DashboardKpiChart from "../components/DashboardKpiChart.vue";
import DashboardModules from "./DashboardModules.vue";
import DashboardTestcases from "./DashboardTestcases.vue";
import DashboardRisks from "./DashboardRisks.vue";
import { ens as modules } from "../lib/stores/modules";
import { ens as kpis } from "../lib/stores/kpis";
import { ens as allmeasures } from "../lib/stores/allmeasures";
import { ens as testcases } from "../lib/stores/testcases";
import { ens as risks } from "../lib/stores/risks";
import { ens as systems, activeSystem } from "../lib/stores/systems.js";
import { ens as risks2all } from "../lib/stores/risks2all";
import { MODAL_PROPS } from "../lib/shared/constants";
import { useDialog } from "primevue/usedialog";
import StoppEditor from "../components/StoppEditor.vue";
import { MAILER_URL } from "../lib/shared/constants.js";

// const kpi1 = ref();
//const kpi2 = ref();
const dialog = useDialog();
const maxSteps = 6;

const kpi3 = ref();
const kpi4 = ref();
const stepiDefault = 1;
const stepi = ref(stepiDefault);

const kpi1 = computed(() => {
  return kpis.dashboardKpis[0];
});
const kpi2 = computed(() => {
  return kpis.dashboardKpis[1];
});

function resetStepi() {
  stepi.value = stepiDefault;
  kpis.init();
  risks.resetAlarmcounter();
  modules.resetAlarmcounter();
  //risks2all.init();
}

function reloadAll() {
  risks.init();
  kpis.init();
  //allmeasures.init();
  testcases.init();
  stepi.value++;
  console.log("stepi", stepi.value);
  createKpiAlarmsByIndex(stepi.value);
}

function parseStringToJson(str) {
  let res = {};
  try {
    console.log("JSON parse string: ", str);
    res = JSON.parse(str);
    console.log("JSON parse object: ", res);
  } catch (e) {
    console.log("ERROR in SCRIPT: ", str);
    console.log(e.message);
  }
  return res;
}

function createKpiAlarmsByIndex(stepIndex) {
  let kpiheadline = "";
  let text = "";
  let br = " \n";
  console.log("checkKpiAlarms.stepi:", stepIndex);
  kpis.dashboardKpis.forEach((kpi) => {
    let kpialarms = [];
    let chartData = parseStringToJson(kpi.chartdata);
    let time = chartData.labels[stepIndex - 1];
    if (!time) time = "(-)";
    console.log("checkKpiAlarms.kpi: ", kpi.title);
    kpiheadline = time + ": KIC-Alarm for KPI: " + kpi.title + ": ";
    //kpiheadline += " and Timepoint: [" + time + "]" + br;

    chartData.datasets.forEach((ds) => {
      let label = ds.label;
      let v = ds.data[stepIndex - 1];
      let label_pre = label;
      if (kpi.max && v > kpi.max) {
        kpialarms.push(
          label_pre
          // " ist zu hoch (" +
          // v +
          // " größer als Maximum " +
          // kpi.max +
          // " )!" +
          // br
        );
        console.log("checkKpiAlarms.max.alarm");

        // let alarmmsgs = getAlarmMessagesForKpi(kpi, 1);
        // alarms.push(...alarmmsgs);
      }
      if (kpi.min && v < kpi.min) {
        kpialarms.push(
          label_pre
          // " ist zu niedrig (" +
          // v +
          // " kleiner als Minimum " +
          // kpi.min +
          // ")!" +
          // br
        );
        console.log("checkKpiAlarms.min.alarm");

        // let alarmmsgs = getAlarmMessagesForKpi(kpi, -1);
        // alarms.push(...alarmmsgs);
      }
    });
    console.log("checkKpiAlarms.alarms per KPI " + kpi.title);
    console.log("checkKpiAlarms.kpialarms.length", kpialarms.length);
    if (kpialarms.length > 0) {
      text += kpiheadline + kpialarms;
      console.log("checkKpiAlarms.alarmtext.added: ", kpialarms);
    }
  });

  let alarm_email = systems.system.alarm_email;
  console.log("checkKpiAlarms.alarmtext.END: ", text);
  console.log("checkKpiAlarms.alarm_email", alarm_email);

  if (alarm_email.length > 0 && text.length > 0) {
    const mailer_url =
      MAILER_URL + "?mail=" + alarm_email + "&title=KIC-ALARM&text=" + text;

    console.log("mailerurl:", mailer_url);

    try {
      fetch(mailer_url);
    } catch (error) {
      console.log(
        "-- Please define the VITE_MAILER_URL in the .env-Variable.--"
      );
      console.log(error);
    }
  }
}

onMounted(async () => {
  await kpis.init();
});

const items = ref([
  // { label: "Dashboard", icon: "pi pi-plus" },
  // { label: "Daten Monitoring", icon: "pi pi-search" },
  // { label: "Autonomiestufen", icon: "pi pi-search" },
  // { label: "Logs", icon: "pi pi-search" },
  // { label: "Einstellungen", icon: "pi pi-search" },
]);

function updateAllKpis() {
  kpis.updateAllKpiValues();
  kpi2.value.title = "test";
  //kpi2.value.chartdata = "{}";
}

const showForm = (id) => {
  let header = "Stopptaste gedrückt!";
  const dialogRef = dialog.open(StoppEditor, {
    data: {},
    props: {
      ...MODAL_PROPS,
      header: header,
    },
    onCancel: (e) => {
      console.log(e);
    },
  });
};
</script>

<template>
  <div class="dashboard">
    <div class="menu">
      <h1>KI-Cockpit Dashboard</h1>
      <Menu :model="items" v-if="false" />
      <Button
        label="Stop"
        severity="danger"
        size="large"
        icon="pi pi-times"
        class="stop-button"
        @click="showForm(11)"
      >
        KI-Stopp-Taste
      </Button>
      <br />
      <Button
        v-if="stepi < maxSteps"
        class="step-button"
        type="button"
        @click="reloadAll()"
        severity="secondary"
        outlined
        >Nächste Demo-Woche</Button
      >

      <Button
        class="reset-button"
        type="button"
        @click="resetStepi()"
        severity="info"
        outlined
        >Reset</Button
      >
    </div>

    <div class="main-content">
      <div class="top-menu"></div>
      <div class="content-list">
        <div class="content-box" v-for="dkpi in kpis.dashboardKpis">
          <DashboardKpiChart :kpi="dkpi" :stepi="stepi" />
        </div>
        <div class="content-box">
          <h2>Module</h2>
          <DashboardModules />
        </div>
        <div class="content-box" v-if="false">
          <DashboardRisks :stepi="stepi" />
        </div>

        <div class="content-box" v-if="false">
          <h2>Erreichen der Zielwerte in Testcases</h2>
          <DashboardTestcases />
        </div>

        <div class="content-box" v-if="false">
          <h3>{{ risks.current.length }}</h3>
          <h3>Risiken</h3>
          <p>Ihre definierten Risiko-Management-Prozesse</p>
        </div>
        <div class="content-box" v-if="false">
          <h3>{{ allmeasures.current.length }}</h3>
          <h3>Maßnahmen</h3>
          <p>Ihre festgelegten Maßnahmen</p>
        </div>
        <div class="content-box" v-if="false">
          <h3>{{ kpis.current.length }}</h3>
          <h3>KPIs</h3>
          <p>
            KPI, zu denen sie benachrichtigt werden. Davon
            {{ kpis.dashboardKpis.length }} im Cockpit sichtbar.
          </p>
        </div>
        <div class="content-box" v-if="false">
          <h3>{{ testcases.current.length }}</h3>
          <h3>Testcases</h3>
          <p>Ihre definierten Testcases und Ergebnisse</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  font-family: Arial, sans-serif;
  display: flex;
  height: 100vh;
}

.menu {
  width: 20%;
  background-image: linear-gradient(90deg, #e93e3a 0%, #f59647 100%);
  color: #fff;
  padding: 20px;
  overflow-y: auto;
}

.menu a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px 0;
}

.menu a:hover {
  background-color: #444;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f9;
  overflow-y: auto;
}

.content-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.content-box {
  flex: 1 1 calc(33% - 10px);
  /* Adjusts width and gap */
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.stop-button {
  border: solid;
}

.step-button {
  background-color: #f48326;
  color: white;
}

.reset-button {
  background-color: #f48326;
  color: white;
}

@media (max-width: 768px) {
  .content-box {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .content-box {
    flex: 1 1 100%;
  }
}

.kic-verlauf {
  --bg-gradient: linear-gradient(90deg, #e93e3a 0%, #f59647 100%);
  --bg-overlay-color: transparent;
}

.kic-primary {
  background-color: #e68332;
  color: #fff;
}

.kic-error {
  color: #e93e3a;
}

.kic-success {
  color: #2b8753;
}

.kic-warning {
  color: #f48326;
}

.kic-info {
  color: #25649c;
}

.kic-secondary {
  background-color: #fff;
  color: #e93e3a;
}

.kic-background {
  background-color: #fefefe;
}

.kic-background-paper {
  background-color: #fff;
}
</style>
