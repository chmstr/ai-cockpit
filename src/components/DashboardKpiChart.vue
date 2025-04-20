<script setup>
import { ref, onMounted, watch } from "vue";
import { ens as risks } from "../lib/stores/risks";
import { ens as modules } from "../lib/stores/modules";
import { ens as risks2all } from "../lib/stores/risks2all";

const demoMode = true; //demostepper mode

const props = defineProps(["kpi", "stepi"]);

const primeChart = ref();
const chartData = ref();
const chartOptions = ref();
const headline = ref();

onMounted(() => {
  console.log("kpiprop: ", props.kpi);
  if (props.kpi.chartdisplaymode == 3) {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    //animateBlink();
  } else console.log("dashboard without kpis of displaymode ==3");
});

watch(
  () => props.kpi,
  (newValue, oldValue) => {
    console.log("dashboard kpi changed: ", newValue);
    // myPropKpi.value = newValue; // Update the value in the ref if needed

    chartData.value = setChartData();
    chartOptions.value = setChartOptions();

    // console.log("dashboard primechart", primeChart);

    //primeChart.value.chart.update();
  }
);

const setChartData = () => {
  let str = props.kpi.chartdata;

  let res = {};
  try {
    console.log("JSON parse string: ", str);
    //res = eval("(" + str + ")");
    res = JSON.parse(str);
    console.log("JSON parse object: ", res);
  } catch (e) {
    console.log("ERROR in SCRIPT: ", str);
    console.log(e.message);
  }
  //console.log("chartdata1: ", res);

  res = createAlarmMessages(res);
  res = addKpiAlarmZones(res);

  if (demoMode) return demoStepChartData(res);
  else return res;
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  let res = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          boxWidth: 20,
          font: {
            size: 15,
          },
        },
      },
    },
    transitions: {
      show: { type: "boolean", duration: 1000 },
    },
    animation: {
      duration: 0,
    },
    animations: {},
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };

  return res;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function demoStepChartData(cd) {
  console.log("demo: reduce auf stepi:", props.stepi);

  cd.datasets.forEach((ds) => {
    // console.log("demo: old ds.data:", ds.data);
    ds.data.splice(props.stepi);
    // console.log("demo: demo ds.data:", ds.data);
  });

  console.log("demo: ", cd);
  return cd;
}

const alarms = ref(new Array());

function getAlarmMessagesForKpi(thiskpi, minmax) {
  const messages = new Array();

  if (true) {
    //risks
    console.log("thiskpi.$id", thiskpi.$id);
    console.log("risks2all.current", risks2all.current);
    let r2as = risks2all.current.filter((r2a) => r2a.kpi?.$id === thiskpi.$id);
    console.log("r2as.len: ", r2as.length);
    console.log("r2as: ", r2as);

    console.log("updateRiskAlarmcounter: ----------------------------------");

    //risks.init();

    r2as.forEach((r2a) => {
      let r = r2a.risk;
      console.log("updateRiskAlarmcounter: CacheR2A.Risk", r);

      let ri = risks.getById(r.$id);
      console.log("updateRiskAlarmcounter: Risk", ri);

      let oldc = ri.alarmcounter;
      console.log("updateRiskAlarmcounter: props.stepi", props.stepi);
      if (props.stepi == 1) {
        console.log("updateRiskAlarmcounter: stepi == 1");
        oldc = 0;
      } else console.log("updateRiskAlarmcounter: stepi != 1");

      console.log("updateRiskAlarmcounter: oldc == ", oldc);
      let newc = oldc + 1;
      console.log("updateRiskAlarmcounter: newc", newc);

      let u = { alarmcounter: newc, $id: r.$id };
      console.log("updateRiskAlarmcounter:", r.$id);
      console.log("updateRiskAlarmcounter: Risk.oldValue", oldc);
      console.log("updateRiskAlarmcounter: Risk.newValue", newc);
      console.log("updateRiskAlarmcounter: update", u);
      risks.update(u);

      messages.push("Risiko: " + r.title);
      console.log("updateRiskAlarmcounter");
    });
  }

  //modules
  thiskpi.modules.forEach((module) => {
    let newc = module.alarmcounter + 1;
    let u = { alarmcounter: newc, $id: module.$id };
    modules.update(u);

    // console.log("alarm.counter.old: ", oldc);
    // console.log("alarm.counter.new: ", newc);
    // console.log("alarm.module: ", module);
    messages.push("Modul: '" + module.title + "' betroffen.");
  });

  return messages;
}

function createAlarmMessages(cd) {
  alarms.value.length = 0;
  let time = cd.labels[props.stepi - 1];
  if (!time) time = " aktuellen Datenpunkt";

  cd.datasets.forEach((ds) => {
    let label = ds.label;
    let v = ds.data[props.stepi - 1];
    headline.value = "Benachrichtigungen für " + time;
    let msg = "Wert für " + label;
    if (props.kpi.max && v > props.kpi.max) {
      alarms.value.push(msg + " ist zu hoch (" + v + ")!");

      let alarmmsgs = getAlarmMessagesForKpi(props.kpi, 1);
      alarms.value.push(...alarmmsgs);
    }
    if (props.kpi.min && v < props.kpi.min) {
      alarms.value.push(msg + "  ist zu niedrig (" + v + ")!");

      let alarmmsgs = getAlarmMessagesForKpi(props.kpi, -1);
      alarms.value.push(...alarmmsgs);
    }
  });

  // fetch(
  //   "http://www.hypsi.de/dev/kic/endpointsimulator/mailer.php?mail=thomas.latka@gmail.com&title=alarm&text=alarmtext"
  // );

  return cd;
}

function addKpiAlarmZones(cd) {
  // let colors = ["orange", "green", "blue"];
  let colors = ["#5ACAF8", "#A847E3", "#FEC93B", "#272264"];

  let i = 0;

  cd.datasets.forEach((ds) => {
    ds.borderColor = colors[i];
    ds.borderWidth = 2;
    i++;

    ds.pointBackgroundColor = function (context) {
      const value = context.raw;
      let c = "#dddddd";
      if (props.kpi.max && value > props.kpi.max) c = "red";
      if (props.kpi.min && value < props.kpi.min) c = "red";
      return c;
    };

    ds.pointBorderColor = function (context) {
      const value = context.raw;
      let c = "#707070";
      if (props.kpi.max && value > props.kpi.max) c = "red";
      if (props.kpi.min && value < props.kpi.min) c = "red";
      return c;
    };
    ds.pointRadius = function (context) {
      const value = context.raw;
      let r = 4;
      if (props.kpi.min && value < props.kpi.min) r = 8;
      if (props.kpi.max && value > props.kpi.max) r = 8;
      return r;
    };
  });

  let min_data = Array(props.stepi).fill(props.kpi.min);
  let max_data = Array(props.stepi).fill(props.kpi.max);

  let ds_max = {
    label: "max",
    data: max_data,
    borderColor: "red",
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    fill: -1,
    borderDash: [5, 5],
    tension: 0.4,
    pointRadius: 2,
  };
  if (props.kpi.max) cd.datasets.push(ds_max);

  let ds_min = {
    label: "min",
    data: min_data,
    borderColor: "red",
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    // fill: true,
    borderDash: [5, 5],
    tension: 0.4,
    pointRadius: 2,
  };
  if (props.kpi.min) cd.datasets.push(ds_min);

  return cd;
}

let limit = 60;
const addData = () => {
  const chart = primeChart.value.chart;
  chart.data.labels.push((limit += 10));
  chart.data.datasets[0].data.push(getRandomInt(0, 35));
  chart.update();
};

const size = ref(1);

const increaseSize = () => {
  size.value += 1;
};

const decreaseSize = () => {
  if (size.value > 1) size.value -= 1;
};
</script>

<template>
  <div class="kpichart">
    KPI: {{ kpi.title }}
    <span v-if="props.kpi.max"> / Max: {{ props.kpi.max }}</span>
    <span v-if="props.kpi.min"> / Min: {{ props.kpi.min }}</span>
    <Chart ref="primeChart"
           v-if="props.kpi.chartdisplaymode == 3"
           :type="props.kpi.charttype"
           :data="chartData"
           :options="chartOptions"
           :key="props.kpi.$updatedAt" />
    <strong><span v-if="alarms.length == 0">Keine </span> {{ headline }}</strong>
    <ul>
      <li v-for="alarm in alarms">{{ alarm }}</li>
    </ul>
  </div>
  <div class="controls"
       v-if="false">
    <button @click="increaseSize">Größer</button>
    <button @click="decreaseSize">Kleiner</button>
  </div>
</template>
<style scoped>
.kpichart {
  border: 1px solid #eeeeee;
  text-align: left;
  min-width: 400px;
}

.del {}
</style>
