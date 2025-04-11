<script setup>
import { ref, onMounted } from "vue";
import { useDialog } from "primevue/usedialog";
import Kpi from "../components/Kpi.vue";

const dialog = useDialog();
const props = defineProps(["kpi"]);
const divid = "kpi" + props.kpi.$id + "chart";
const kpimin = props.kpi.min;
const kpimax = props.kpi.max;
const kpiconfig = props.kpi.config;
const en_name = "KPI";
const ens_name = "KPIs";

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  // let res = JSON.parse(props.kpi.chartdata);
  // console.log("chartdata1: ", res);

  let str = props.kpi.chartdata;
  //console.log("chartdata0: ", str);

  let res = {};
  try {
    res = eval("(" + str + ")");
  } catch (e) {
    console.log("ERROR in SCRIPT: ", str);
    console.log(e.message);
  }
  //console.log("chartdata1: ", res);

  return res;
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  let res = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
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

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Kpi, {
    data: {
      id: id,
    },
    props: {
      header: header,
      modal: true,
      style: {
        width: "60vw",
      },
      breakpoints: {
        "960px": "65vw",
        "640px": "80vw",
      },
    },
    onCancel: (e) => {
      console.log(e);
    },
  });
};

onMounted(() => {
  //console.log("kpiconfig: -" + kpiconfig + "-")
  //console.log("len: " + kpiconfig?.length);

  if (props.kpi.chartdisplaymode == 3) {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }

  if (props.kpi.chartdisplaymode == 4) {
    let evalscript = kpiconfig.replace("myDiv", divid);
    //console.log(evalscript)
    try {
      eval(evalscript);
    } catch (e) {
      console.error("ERROR in SCRIPT:", evalsript);
      console.error(e.message);
    }
  }
});
</script>

<template>
  <div class="kpichart">
    <Button severity="secondary" @click="showForm(props.kpi.$id)">
      Edit
    </Button>
    {{ props.kpi.title }}
    <Chart
      v-if="props.kpi.chartdisplaymode == 3"
      :type="props.kpi.charttype"
      :data="chartData"
      :options="chartOptions"
      :key="props.kpi.title"
    />
    <div :id="divid"></div>
  </div>
</template>
<style scoped>
.kpichart {
  border: 1px solid;
  text-align: left;
  width: 49%;
}
</style>
