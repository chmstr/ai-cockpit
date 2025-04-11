<script setup>
import ModuleCharts from "../components/ModuleAutonomyList.vue";
import TestcaseList from "../components/TestcaseList.vue";
import RuleList from "../components/RuleList.vue";
import System from "../components/System.vue";
import SystemList from "../components/SystemList.vue";
import ModuleList from "../components/ModuleList.vue";
import LogentryList from "../components/LogentryList.vue";
import KpiList from "../components/KpiList.vue";
import KpiCharts from "../components/KpiCharts.vue";
import RiskList from "../components/RiskList.vue";
import Riskpool from "../components/Riskpool.vue";
import MeasureList from "../components/MeasureList.vue";
import AllMeasureList from "../components/AllMeasureList.vue";
import Risks2MeasuresList from "../components/Risks2MeasuresList.vue";
import RMChart from "../components/RMChart.vue";
import { ens as systems } from "../lib/stores/systems";
import { isGlobalAdmin } from "../lib/stores/user";
import Dashboard from "../components/Dashboard.vue";
import DashboardFlex from "../components/DashboardFlex.vue";
import ModuleAutonomyList from "../components/ModuleAutonomyList.vue";
</script>

<template>
  <DynamicDialog />
  <TabView v-if="true">
    <TabPanel header="KIC Dashboard">
      <DashboardFlex />
    </TabPanel>
    <TabPanel header="KIC Konfiguration">
      <TabView>
        <TabPanel header="Module">
          <ModuleList />
        </TabPanel>
        <TabPanel header="Risikopool">
          <Riskpool selectmode="true" />
        </TabPanel>
        <TabPanel header="Risiken">
          <RiskList />
        </TabPanel>
        <TabPanel header="Maßnahmen">
          <TabView>
            <TabPanel header="Maßnahmenliste">
              <AllMeasureList />
            </TabPanel>
            <TabPanel header="KPIs">
              <KpiList />
            </TabPanel>
            <TabPanel header="Testcases">
              <TestcaseList />
            </TabPanel>
            <TabPanel header="Regeln">
              <RuleList />
            </TabPanel>
            <TabPanel header="Sonst. Maßnahmen">
              <MeasureList />
            </TabPanel>
          </TabView>
        </TabPanel>
        <TabPanel header="Risiko-Management">
          <Risks2MeasuresList />
        </TabPanel>
        <!-- <TabPanel header="Admin">
          <System id="664d22cbc1af63a17822" />
        </TabPanel> -->
        <!-- <TabPanel header="Risiko-Management-Chart">
          <RMChart :key="systems.systemId" />
        </TabPanel> -->
      </TabView>
    </TabPanel>
    <TabPanel header="KIC Operation" v-if="isGlobalAdmin">
      <TabView>
        <TabPanel header="KPI-Charts">
          <KpiCharts />
        </TabPanel>
        <TabPanel header="Autonomiestufen">
          <ModuleAutonomyList />
        </TabPanel>
        <TabPanel header="Logs">
          <LogentryList />
        </TabPanel>
      </TabView>
    </TabPanel>
    <TabPanel header="KIC Admin" v-if="isGlobalAdmin">
      <TabView>
        <TabPanel header="Systeme">
          <SystemList />
        </TabPanel>
        <TabPanel header="Risikopool">
          <Riskpool />
        </TabPanel>
      </TabView>
    </TabPanel>
  </TabView>
</template>

<style scoped></style>
