<script setup>
import InputSwitch from "primevue/inputswitch";
import { ref, onMounted, computed } from "vue";
import { user, canEdit } from "../lib/stores/user";
import {
  ens as autonomylevels,
  getAutonomyLevelsByModuleId,
} from "../lib/stores/autonomylevels";
import { MODAL_PROPS } from "../lib/shared/constants";
import LevelChangeEditor from "./LevelChangeEditor.vue";
import { useDialog } from "primevue/usedialog";

const props = defineProps(["module"]);
const dialog = useDialog();
const levels = ref();
const moduleChecked = ref(true);
const selectedOption = ref(props.module.autonomylevel);
const levelOptions = ref([]);

onMounted(() => {
  levels.value = getAutonomyLevelsByModuleId(props.module.$id);
  console.log("DashboardModule.levels.value: ", levels.value);
});

const alevels = computed(() => {
  console.log("alevels.computed");
  let ls = getAutonomyLevelsByModuleId(props.module.$id);
  ls.sort((a, b) => (a.level < b.level ? -1 : a.level > b.level ? 1 : 0));

  levelOptions.value = [];
  ls.forEach((l) => {
    levelOptions.value.push(l.level);
  });

  console.log("moduleChecked.ls.length", ls.length);
  console.log("moduleChecked.ls[0].level", ls[0]?.level);
  console.log(
    "moduleChecked.props.module.autonomylevel",
    props.module.autonomylevel
  );
  if (ls.length == 2 && ls[0]?.level == props.module.autonomylevel) {
    moduleChecked.value = false;
    console.log("moduleChecked.value -> false");
  } else {
    moduleChecked.value = true;
    console.log("moduleChecked.value -> true");
  }

  if (ls.length > 2) {
    selectedOption.value = props.module.autonomylevel;
    console.log("selectedOption actualized");
  }

  return ls;
});

const selValue = computed(() => {
  return props.module.autonomylevel;
});

const showAutonomyLevelForm = (id, newLevel) => {
  let header = "Update Autonomy-Level";
  const dialogRef = dialog.open(LevelChangeEditor, {
    data: {
      id: id,
      newLevel: newLevel,
    },
    props: {
      ...MODAL_PROPS,
      header: header,
    },
    onCancel: (e) => {
      selValue.value = props.module.autonomylevel;
      console.log(e);
      console.log(
        "DashboardModule.Formdef.oncancel: set selValue back to: ",
        props.module.autonomylevel
      );
    },
  });
};

const pendingSwitchValue = ref(null);
const pendingSelectValue = ref(null);

const handleSwitchClick = (event) => {
  event.preventDefault(); // Verhindert direktes Umschalten
  pendingSwitchValue.value = !moduleChecked.value; // Speichert den neuen Wert temporär
  let checkValue = pendingSwitchValue.value;
  console.log("onLevelSwitched.level switched to ", checkValue);
  let newLevel = 0;
  console.log("onLevelSwitched.alevels: ", alevels.value);
  if (checkValue) {
    console.log(
      "onLevelSwitched.alevels.value[1].level ",
      alevels.value[1].level
    );
    newLevel = alevels.value[1].level;
  } else {
    console.log(
      "onLevelSwitched.alevels.value[0].level ",
      alevels.value[0].level
    );
    newLevel = alevels.value[0].level;
  }
  console.log("onLevelSwitched.param.newLevel: ", newLevel);

  showAutonomyLevelForm(props.module.$id, newLevel);
};

const handleSelection = (value) => {
  console.log("old value", selectedOption.value); // Alter Wert
  console.log("proposed value", value); //Neuer Wert

  pendingSelectValue.value = value; // Neuen Wert speichern

  if (props.module.autonomylevel !== value) {
    console.log("value changed");
    showAutonomyLevelForm(props.module.$id, value);
  } else {
    console.log("no value change, no action.");
  }
};
</script>

<template>
  <div class="name">
    {{ props.module.title }} ({{ alevels?.length }} Level) <br />Aktiv: Level
    {{ props.module.autonomylevel }} <br />
    Stopp-Level: {{ props.module.stoplevel }}
    <!-- [{{ alevels }}] -->
    <!-- ({{ levels.length }} Levels) <br /> Aktiv: Level {{ props.module.autonomylevel }} -->
  </div>
  &nbsp;

  <template v-if="canEdit">
    <div class="switch" v-if="alevels?.length == 2">
      <InputSwitch v-model="moduleChecked" @click="handleSwitchClick" />
    </div>
    <div class="switch" v-if="alevels?.length > 2">
      <div class="card flex justify-content-center">
        <SelectButton
          :modelValue="selectedOption"
          :options="levelOptions"
          aria-labelledby="basic"
          @update:modelValue="handleSelection"
        />
      </div>
    </div>
  </template>
</template>
<style scoped>
.name {
  flex: 50%;
  text-align: left;
  font-size: smaller;
}
.switch {
  flex: 50%;
  text-align: right;
}
</style>
