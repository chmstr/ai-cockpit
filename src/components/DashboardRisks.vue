<script setup>
import { ref, watch, onMounted } from "vue";
import { ens as risks } from "../lib/stores/risks";

const chartData = ref();
const chartOptions = ref();

const props = defineProps(["stepi"]);

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

watch(
  () => risks.current,
  (newValue, oldValue) => {
    console.log("risks.current.changed: ", risks.current);

    chartData.value = setChartData();
    chartOptions.value = setChartOptions();

    // console.log("dashboard primechart", primeChart);

    //primeChart.value.chart.update();
  }
);

const setChartData = () => {
  //
  let t1data = {
    labels: ["TransparenzL", "FairnessL", "SicherheitL"],
    datasets: [
      { label: "TransparenzDSL", data: [11] },
      { label: "FairnessDSL", data: [2] },
      { label: "SicherheitDSL", data: [30] },
    ],
  };

  let t4data = {
    labels: [],
    datasets: [
      { label: "Transparenz", data: [11] },
      { label: "Fairness", data: [2] },
      { label: "Sicherheit", data: [30] },
    ],
  };

  //live version
  let t2data = {
    labels: ["Transparenz", "Fairness", "Sicherheit"],
    datasets: [
      { label: "...", data: [11, 2, 30] },
      { label: "red", data: [4, 4, 4], type: "line" },
      { label: "orange", data: [2, 2, 2], type: "line" },
    ],
  };

  let t3data = {
    labels: ["Alarmmeldungen"],
    datasets: [
      { label: "Transparenz", data: [11] },
      { label: "Fairness", data: [2] },
      { label: "Sicherheit", data: [30] },
    ],
  };

  //from here dynamic

  let rdata = new Array();
  let labels = new Array();
  let datasets = new Array();

  risks.current.forEach((risk) => {
    let label = risk.title;
    if (risk.alarmcounter > 0) labels.push(label);
  });
  rdata.labels = labels;
  console.log("riskchartdata.labels: ", rdata);

  //datasets
  // risks.current.forEach((risk) => {
  //   let counter = risk.alarmcounter;
  //   let label = risk.title;

  //   let datas = new Array();
  //   datas.push(counter);
  //   let dataset;
  //   dataset.label = label;
  //   dataset.data = datas;

  //   datasets.push(dataset);
  // });

  let datas = new Array();
  risks.current.forEach((risk) => {
    let d = risk.alarmcounter;
    if (d > 0) datas.push(d);
  });

  let dataset = new Object();
  dataset.label = "Alarmmeldungen pro Risiko";
  dataset.data = datas;

  datasets.push(dataset);
  rdata.datasets = datasets;

  // console.log("riskchartdata.datasets: ", rdata);
  // console.log("riskchartdata.risks: ", risks.current);
  console.log("riskchartdata.radata: ", rdata);
  console.log("riskchartdata.tdata: ", t2data);

  rdata = addDataColors(rdata);

  //rdata = addAlarmZones(rdata);

  return rdata;
};

const orange_alarm = 2;
const red_alarm = 3;

function addAlarmZones(cd) {
  let red_dataset = {
    label: "Red Alarm",
    data: [3, 3, 3],
    borderColor: "red",
  };
  cd.datasets.push(red_dataset);
}

function addDataColors(cd) {
  let colors = ["orange", "green", "blue"];
  let i = 0;

  cd.datasets.forEach((ds) => {
    ds.borderColor = colors[i];
    i++;

    ds.backgroundColor = function (context) {
      const value = context.raw;
      let c = "green";
      if (value > orange_alarm) c = "orange";
      if (value > red_alarm) c = "red";
      return c;
    };
  });
  return cd;
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    indexAxis: "y",
    plugins: {
      title: {
        text: "Alarmmeldungen pro Risiko",
        display: true,
      },
      legend: {
        display: false,
        labels: {
          color: "textColor",
        },
      },
    },
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        min: 0,
        suggestedMax: 6,
      },
      r: {
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>

<template>
  <div>
    <div class="card flex justify-content-center riskchart">
      <Chart
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="w-full md:w-30rem"
      />
    </div>
    <ul>
      <li v-for="risk in risks.current" v-if="false">
        {{ risk.title }}: {{ risk.alarmcounter }}
      </li>
    </ul>
  </div>
</template>
<style scoped>
.riskchart {
}
</style>
