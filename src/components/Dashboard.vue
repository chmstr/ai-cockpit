<script setup>
import { onMounted, ref, computed } from "vue";
import DashboardKpiChart from "../components/DashboardKpiChart.vue";
import DashboardModules from "./DashboardModules.vue";
import DashboardTestcases from "./DashboardTestcases.vue";
import { ens as kpis } from "../lib/stores/kpis";
import { ens as allmeasures } from "../lib/stores/allmeasures";
import { ens as testcases } from "../lib/stores/testcases";
import { ens as risks } from "../lib/stores/risks";

// const kpi1 = ref();
//const kpi2 = ref();
const kpi3 = ref();
const kpi4 = ref();

const kpi1 = computed(() => {
  return kpis.dashboardKpis[0];
});
const kpi2 = computed(() => {
  return kpis.dashboardKpis[1];
});

function reloadAll() {
  risks.init();
  kpis.init();
  //allmeasures.init();
  testcases.init();
}

onMounted(async () => {
  await kpis.init();
  // kpi1.value = kpis.dashboardKpis[0];
  // kpi2.value = kpis.dashboardKpis[1];
  // kpi3.value = kpis.dashboardKpis[2];

  // kpi1.value = kpis.current.filter(function (o) {
  //   return o.$id == "6784f7f782bb5737769e";
  // })[0];
  // kpi2.value = kpis.current.filter(function (o) {
  //   return o.$id == "6784f54b2ee554b174b7";
  // })[0];

  console.log("dashboard page kpi1: ", kpi1);
  console.log("dashboard page kpi2: ", kpi2);
});

const items = ref([
  { label: "Dashboard", icon: "pi pi-plus" },
  { label: "Daten Monitoring", icon: "pi pi-search" },
  { label: "Autonomiestufen", icon: "pi pi-search" },
  { label: "Logs", icon: "pi pi-search" },
  { label: "Einstellungen", icon: "pi pi-search" },
]);

function updateAllKpis() {
  kpis.updateAllKpiValues();
  kpi2.value.title = "test";
  //kpi2.value.chartdata = "{}";
}
</script>

<template>
  <div class="grid-container">
    <div class="header rbox"><h1>Dashboard</h1></div>
    <div class="menu">
      <h1>KI-Cockpit</h1>
      <Menu :model="items" />
      <Button
        id="stopp"
        label="Stop"
        severity="danger"
        size="large"
        icon="pi pi-times"
        class="stopp"
      >
        Stopp
      </Button>

      <Button
        class="test-button"
        type="button"
        @click="reloadAll()"
        severity="info"
        outlined
        >Refresh</Button
      >
    </div>
    <div class="main rbox">
      <h2>Übersicht</h2>
      <p>
        Ihre getroffenen Einstellungen zur Steuerung des CHEMISTREE Matchings
      </p>
      <div class="linkboxcontainer">
        <span class="linkbox box1">
          <h3>{{ risks.current.length }}</h3>
          <h3>Risiken</h3>
          <p>Ihre definierten Risiko-Management-Prozesse</p>
        </span>
        <span class="linkbox box2">
          <h3>{{ allmeasures.current.length }}</h3>
          <h3>Maßnahmen</h3>
          <p>Ihre festgelegten Maßnahmen</p>
        </span>
        <span class="linkbox box3">
          <h3>{{ kpis.current.length }}</h3>
          <h3>KPIs</h3>
          <p>
            KPI, zu denen sie benachrichtigt werden. Davon
            {{ kpis.dashboardKpis.length }} im Cockpit sichtbar.
          </p>
        </span>
        <span class="linkbox box4">
          <h3>{{ testcases.current.length }}</h3>
          <h3>Testcases</h3>
          <p>Ihre definierten Testcases und Ergebnisse</p>
        </span>
      </div>
    </div>
    <div>
      Dkpis list:
      <li v-for="dkpi in kpis.dashboardKpis">
        {{ dkpi.title }}: {{ dkpi.chartdata }}
      </li>
    </div>
    <div class="chart1 rbox">
      <DashboardKpiChart :kpi="kpi1" v-if="kpi1" />
    </div>
    <div class="chart2 rbox">
      <DashboardKpiChart :kpi="kpi2" v-if="kpi2" />
    </div>
    <div class="chart3 rbox">
      <DashboardKpiChart :kpi="kpi3" v-if="kpi3" />
    </div>
    <div class="chart4 rbox">
      <DashboardKpiChart :kpi="kpi4" v-if="kpi4" />
    </div>
    <div class="tests rbox">
      <h2>Erreichen der Zielwerte in Testcases</h2>
      <DashboardTestcases />
    </div>
    <div class="modules rbox">
      <h2>Module</h2>
      <DashboardModules />
    </div>
  </div>
  <section></section>
</template>
<style>
.rbox {
  border-radius: 10px;
}

#stopp.p-button {
  color: #ffffff;
  background: #a847e3;
  border: none;
}

.stopp {
  margin-top: 50px;
  padding: 10px;
  width: 100%;
}

.p-menu {
  background-color: #272264;
  color: white;
  border: none;
}

.p-menu
  .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus
  > .p-menuitem-content {
  background-color: #aaaaaa;
}

.p-menu .p-menuitem > .p-menuitem-content .p-menuitem-link {
  color: white;
}

.p-menuitem-text {
  color: white;
}

.linkboxcontainer {
  display: inline-flex;
  flex-direction: row;
  gap: 10px;
}
.linkbox {
  border-radius: 20px;
  background-color: #a9c7ff;
  color: black;
  padding: 10px;
  flex: 1 1 0;
  min-height: 200px;
}

.box1 {
  background-color: #a9c7ff;
}
.box2 {
  background-color: #c7dbff;
}
.box3 {
  background-color: #d8e5ff;
}
.box4 {
  background-color: #f0f5ff;
}

.header {
  grid-area: header;
}
.menu {
  grid-area: menu;
}
.main {
  grid-area: main;
}
.chart1 {
  grid-area: chart1;
}
.chart2 {
  grid-area: chart2;
}
.chart3 {
  grid-area: chart3;
}
.chart4 {
  grid-area: chart4;
}
.tests {
  grid-area: tests;
}
.modules {
  grid-area: modules;
}

.grid-container {
  display: grid;
  grid-template-areas:
    "menu header header header header header header"
    "menu main main main main chart1 chart1"
    "menu chart2 chart2 chart2 chart3 chart3 chart4"
    "menu tests tests tests modules modules modules";
  gap: 10px;
  background-color: #f0f5ff;
  padding: 10px;
}

.grid-container > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: left;
  padding: 15px 15px;
  font-size: 12px;
}

.grid-container > div.menu {
  background-color: #272264;
  color: white;
}
</style>

<style scoped></style>
