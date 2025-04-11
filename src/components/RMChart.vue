<script setup>
import { ref, watch, inject, onMounted } from "vue";
import { ens as moduleList } from "../lib/stores/modules";
import { ens as riskList } from "../lib/stores/risks";
import { ens as allmeasures } from "../lib/stores/allmeasures";
import { ens as risk2allList } from "../lib/stores/risks2all";
import { ens as systems } from "../lib/stores/systems";
import { resolveType } from "../lib/shared/dropdowns";

const count = ref(0);
const modules = ref([]);
let aids = [];

function getIntID(strid) {
  let i = aids.indexOf(strid);
  if (i > -1) return i;
  else {
    aids.push(strid);
    return aids.indexOf(strid);
  }
}

let risksLoaded = false;
let modulesLoaded = false;
let allmeasuresLoaded = false;
let risk2allListLoaded = false;

watch(
  () => riskList.current,
  (current) => {
    console.log("## current risklist is: ", current);
  }
);
watch(
  risk2allList,
  (newValue, oldValue) => {
    console.log("## risk2allList oldValue: ", oldValue);
    console.log("## risk2allList newValue: ", newValue);
    console.log("## risk2allList changeddd!!! ");
    risk2allListLoaded = true;
    if (modulesLoaded && allmeasuresLoaded && risksLoaded) showArcChart();
    else console.log("## risk2allList waiting for others load");
  },
  { once: true }
);

watch(
  riskList,
  (newValue, oldValue) => {
    console.log("## Risks oldValue: ", oldValue);
    console.log("## Risks newValue: ", newValue);
    console.log("## Risks changeddd!!! ");
    risksLoaded = true;
    if (modulesLoaded && allmeasuresLoaded && risk2allListLoaded)
      showArcChart();
    else console.log("## Risks waiting for others to load");
  },
  { once: true }
);

watch(
  moduleList,
  (newValue, oldValue) => {
    console.log("## Modules oldValue: ", oldValue.current.length);
    console.log("## Modules newValue: ", newValue.current.length);
    console.log("## Modules changeddd!!! ");
    modulesLoaded = true;
    if (risksLoaded && allmeasuresLoaded & risk2allListLoaded) showArcChart();
    else console.log("## Modules waiting for others to load");
  },
  { once: true }
);

watch(
  allmeasures,
  (newValue, oldValue) => {
    console.log("## allmeasures oldValue: ", oldValue);
    console.log("## allmeasures newValue: ", newValue);
    console.log("## allmeasures changeddd!!! ");
    allmeasuresLoaded = true;
    if (risksLoaded && modulesLoaded && risk2allListLoaded) showArcChart();
    else console.log("## onmounted-Check FALSE, waiting or empty ...");
  },
  { once: true }
);

onMounted(() => {
  systems.init();
  let moduleLen = moduleList?.current.length;
  let riskLen = riskList?.current.length;
  let measuresLen = allmeasures?.current.length;
  let risk2allLen = risk2allList?.current.length;
  console.log("## moduleLen:  " + moduleLen);
  console.log("## riskLen: " + riskLen);
  console.log("## measuresLen: " + measuresLen);
  console.log("## risk2allLen: " + risk2allLen);
  if (moduleLen > 0 && riskLen > 0 && measuresLen > 0 && risk2allLen > 0) {
    console.log("## onMounted-Check OK, all Lists loaded, create chart!");
    showArcChart();
  }
});

function showArcChart() {
  let modules = [];
  let risks = [];
  let measures = [];
  let links = [];

  console.log("## module list iterating: ", moduleList);
  moduleList.current.forEach((e) => {
    let t = {};
    t.id = getIntID(e.$id);
    t.name = "Modul: " + e.title;
    t.type = "module";
    t.color = "#6495F0";
    //t.risks = e.risks.map(o => getIntID(o.$id));

    t.risks = e.risks.map((riskObject) => {
      // Annahme: '$id' ist ein Attribut jedes Objekts in 'risksArray'
      const idOfRisk = riskObject.$id;
      // Annahme: 'getIntID' gibt die Integer-ID basierend auf der '$id' zurück
      let riskIntID = getIntID(idOfRisk);
      let link = {};
      link.source = t.id;
      link.target = riskIntID;
      link.type = "modules2risk";
      links.push(link);
      return riskIntID;
    });

    t.rules = e.rules.map((ruleObject) => {
      const idOfRule = ruleObject.$id;
      let ruleIntID = getIntID(idOfRule);
      let link = {};
      link.source = t.id;
      link.target = ruleIntID;
      link.type = "modules2rule";
      links.push(link);
      return ruleIntID;
    });

    t.kpis = e.kpis.map((kpiObject) => {
      const idOfKpi = kpiObject.$id;
      let kpiIntID = getIntID(idOfKpi);
      let link = {};
      link.source = t.id;
      link.target = kpiIntID;
      link.type = "modules2kpi";
      links.push(link);
      return kpiIntID;
    });

    modules.push(t);
  });
  modules.sort((a, b) => a.name.localeCompare(b.name));
  console.log("### modules: ", modules);
  console.log("### links with modules2risk: ", links);

  console.log("## riskList.current: ", riskList.current);
  riskList.current.forEach((e) => {
    let t = {};
    let riskIntID = getIntID(e.$id);
    t.id = riskIntID;
    t.name = "Risiko: " + e.title;
    t.type = "risk";
    t.color = "#FF5733";
    let mids = [];
    //console.log("## risk.measures: ", e.measureids);
    e.measureids?.forEach((e) => {
      let measureIntID = getIntID(e);
      mids.push(measureIntID);
      let link = {};
      link.source = riskIntID;
      link.target = measureIntID;
      link.type = "risk2measure";
      links.push(link);
      //console.log("## pushed risk2measure-link");
    });
    t.measures = mids;
    risks.push(t);
  });
  console.log("risks: ", risks);

  allmeasures.current.forEach((e) => {
    let t = {};
    t.id = getIntID(e.id);
    t.name = resolveType(e.type) + ": " + e.title;
    t.type = e.type;
    t.color = "grey";
    console.log("### allmeasure.type: " + e.type);
    if (e.type == "testcases") t.color = "#50C878";
    else if (e.type == "kpis") t.color = "#49B9A9";
    else if (e.type == "rules") t.color = "#AFE1AF";
    else if (e.type == "measures") t.color = "#088F8F";
    //t.risks = e.risks.map(o => getIntID(o.$id));
    measures.push(t);
  });
  console.log("measures: ", measures);

  //start arc chart
  var da = {};
  let nodes = [];

  nodes.push(...modules);
  console.log("## pushed modules: " + modules.length);
  nodes.push(...risks);
  console.log("## pushed risks: " + risks.length);
  nodes.push(...measures);
  console.log("## pushed measures: " + measures.length);

  da.nodes = nodes;
  da.links = links;
  //da.nodes.push(risks);
  //da.nodes.push(measures);
  console.log("###da: ", da);
  var data = da;

  // set the dimensions and margins of the graph
  const margin = { top: 20, right: 30, bottom: 20, left: 30 },
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  const xsvg = d3.select("#rmchart").selectAll("*").remove();

  // append the svg object to the body of the page
  const tsvg = d3
    .select("#rmchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // List of node names
  const allNodes = data.nodes.map((d) => d.name);

  // A linear scale to position the nodes on the X axis
  const y = d3.scalePoint().range([0, height]).domain(allNodes);

  const xa = 360; //x-chart abstand
  const la = 350; //label abstand
  // Add the circle for the nodes
  const factor = 1;

  const mynodes = tsvg
    .selectAll("mynodes")
    .data(data.nodes)
    .join("circle")
    .attr("cx", xa)
    .attr("cy", (d) => y(d.name) * factor)
    .attr("r", 8)
    .style("fill", (d) => d.color);

  // And give them a label
  const mylabels = tsvg
    .selectAll("mylabels")
    .data(data.nodes)
    .join("text")
    .attr("x", la)
    .attr("y", (d) => y(d.name) * factor)
    .text((d) => d.name)
    .style("text-anchor", "end")
    .style("alignment-baseline", "middle")
    .style("font-size", "14px");

  // Add links between nodes. Here is the tricky part.
  // In my input data, links are provided between nodes -id-, NOT between node names.
  // So I have to do a link between this id and the name
  const idToNode = {};
  data.nodes.forEach(function (n) {
    idToNode[n.id] = n;
  });

  var linecolor = "#b8b8b8";
  // Cool, now if I do idToNode["2"].name I've got the name of the node with id 2
  // Add the links
  var mylinks = tsvg
    .selectAll("mylinks")
    .data(data.links)
    .join("path")
    .attr("d", (d) => {
      let start = y(idToNode[d.source].name) * factor; // X position of start node on the X axis
      let end = y(idToNode[d.target]?.name) * factor; // X position of end node
      return [
        "M",
        xa,
        start, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
        "A", // This means we're gonna build an elliptical arc
        ((start - end) / 2) * 1.5,
        ",", // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
        (start - end) / 2,
        0,
        0,
        ",",
        start < end ? 1 : 0,
        xa,
        ",",
        end,
      ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
        .join(" ");
    })
    .style("fill", "none")
    .attr("stroke", linecolor)
    .attr("stroke-width", 1);

  // Add the highlighting functionality
  mynodes
    .on("mouseover", function (event, d) {
      // Highlight the nodes: every node is green except of him
      //mynodes.style('fill', "#B8B8B8")
      //d3.select(this).style('fill', '#69b3b2')
      // Highlight the connections
      mylinks
        .style("stroke-width", (a) =>
          a.source === d.id || a.target === d.id ? 3 : 1
        )
        .style("stroke", (a) =>
          a.source === d.id || a.target === d.id ? "#5F85F5" : "#b8b8b8"
        );

      mylabels
        .style("text-anchor", "end")
        .style("alignment-baseline", "middle")
        .style("font-size", "14px");
    })
    .on("mouseout", function (event, d) {
      //mynodes.style('fill', "#69b3a2")
      mylinks.style("stroke", linecolor).style("stroke-width", "1");

      mylabels
        .style("text-anchor", "end")
        .style("alignment-baseline", "middle")
        .style("font-size", "14px");
    });
}

function showBoxChart() {
  let modules = [];
  let risks = [];
  let measures = [];

  const xmodules = [
    { id: 1, title: "module 1", risks: [11, 22] },
    { id: 2, title: "module 2", risks: [11, 33] },
    { id: 3, title: "module 3", risks: [33] },
  ];

  const xrisks = [
    { id: 11, title: "risk 11", measures: [111, 333] },
    { id: 22, title: "risk 22", measures: [222, 333] },
    { id: 33, title: "risk 33", measures: [333, 111] },
  ];

  const xmeasures = [
    { id: 111, title: "measure 111" },
    { id: 222, title: "measure 222" },
    { id: 333, title: "measure 333" },
  ];

  //-----------------------------------------------------
  const svg = d3.select("xsvg");

  const a = 110;
  const j = 1;

  // Append modules as boxes
  const moduleBoxes = svg
    .selectAll(".module")
    .data(modules)
    .enter()
    .append("g")
    .attr("class", "module")
    .attr("transform", (d, i) => `translate(${(i + j) * a}, 50)`);

  moduleBoxes
    .append("rect")
    .attr("width", 100)
    .attr("height", 50)
    .attr("fill", "lightblue");

  moduleBoxes
    .append("text")
    .attr("x", 50)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .text((d) => d.name);

  // Append risks as boxes
  const riskBoxes = svg
    .selectAll(".risk")
    .data(risks)
    .enter()
    .append("g")
    .attr("class", "risk")
    .attr("transform", (d, i) => `translate(${(i + j) * a}, 200)`);

  riskBoxes
    .append("rect")
    .attr("width", 100)
    .attr("height", 50)
    .attr("fill", "lightgreen");

  riskBoxes
    .append("text")
    .attr("x", 50)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .text((d) => d.name);

  // Append measures as boxes
  const measureBoxes = svg
    .selectAll(".measure")
    .data(measures)
    .enter()
    .append("g")
    .attr("class", "measure")
    .attr("transform", (d, i) => `translate(${(i + j) * a}, 350)`);

  measureBoxes
    .append("rect")
    .attr("width", 100)
    .attr("height", 50)
    .attr("fill", "lightcoral");

  measureBoxes
    .append("text")
    .attr("x", 50)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .text((d) => d.name);

  // Append lines connecting modules and risks
  modules.forEach((module) => {
    module.risks.forEach((riskId) => {
      const modulePos =
        moduleBoxes.data().findIndex((d) => d.id === module.id) + 1;
      const riskPos = riskBoxes.data().findIndex((d) => d.id === riskId) + 1;

      svg
        .append("line")
        .attr("x1", 50 + modulePos * a)
        .attr("y1", 100)
        .attr("x2", 50 + riskPos * a)
        .attr("y2", 200)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });
  });

  // Append lines connecting risks and measures
  risks.forEach((risk) => {
    risk.measures.forEach((measureId) => {
      const riskPos = riskBoxes.data().findIndex((d) => d.id === risk.id) + 1;
      const measurePos =
        measureBoxes.data().findIndex((d) => d.id === measureId) + 1;

      svg
        .append("line")
        .attr("x1", 50 + riskPos * a)
        .attr("y1", 250)
        .attr("x2", 50 + measurePos * a)
        .attr("y2", 350)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });
  });
}
</script>
<template>
  <div>
    <div id="rmchart"></div>
    <svg width="1400" height="500"></svg>
  </div>
</template>
<style scoped>
.risk {
  font-size: xx-small;
}
</style>
