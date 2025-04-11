<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { useDialog } from 'primevue/usedialog';
import Module from "../components/Module.vue";
import LevelChange from "../components/LevelChange.vue";


const props = defineProps(['module']);
const divid = "module" + props.module.$id + "gaugechart";
const maxlevel = props.module.autonomylevel_max;

const count = ref(0)
const title = "Autonomie-Stufe für Modul " + props.module.title;

const dialog = useDialog();
const en_name = "Module";
const ens_name = "Modules";

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Module, {
    data: {
      id: id
    },
    props: {
      header: header,
      modal: true,
    },
    onCancel: (e) => {
      console.log(e);
    }
  })
};

const showAutonomyLevelForm = (id) => {
  let header = "Update Autonomy-Level";
  const dialogRef = dialog.open(LevelChange, {
    data: {
      id: id
    },
    props: {
      header: header,
      modal: true,
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    },
    onCancel: (e) => {
      console.log(e);
    }
  })
};



onMounted(() => {

  var updatemenus = [];

  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: props.module.autonomylevel,
      title: { text: title },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 100 },
      gauge: {
        axis: { range: [null, maxlevel], tick0: 0, dtick: 1, tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "#0DADB9" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "white",
        steps: [
          { range: [0, 1], color: "#ffffff" },
          { range: [1, 2], color: "#f5f5f5" },
          { range: [2, 3], color: "#eeeeee" },
          { range: [3, 4], color: "#dedede" },
          { range: [4, 5], color: "#c0c0c0" },
          { range: [5, 6], color: "#b0b0b0" },
          { range: [6, 7], color: "#a0a0a0" },
        ],

      },

    }
  ];

  //var layout = { width: 600, height: 400 };

  var layout = {
    width: 300, height: 300,
    margin: { t: 0, b: 0, l: 0, r: 0 },
    updatemenus: updatemenus,
    paper_bgcolor: "#BCE1EA",
    font: { color: "darkblue", family: "Arial" }
  }


  Plotly.newPlot(divid, data, layout);

});

</script>

<template>
  <div class="modulechart">
    Level: {{ props.module.autonomylevel }} of {{ props.module.autonomylevel_max }}
    <Button type="button"
            severity="warning"
            @click="showAutonomyLevelForm(props.module.$id)">
      Change Level</Button>
    <div :id='divid'></div>
  </div>
</template>

<style scoped>
.modulechart {
  border: 1px solid;
  text-align: right;
}
</style>
