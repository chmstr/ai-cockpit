<script setup>
import { onMounted, ref } from "vue";
import { user } from "../lib/stores/user";
import { ens } from "../lib/stores/testcases";
import { useDialog } from "primevue/usedialog";
import { useConfirm } from "primevue/useconfirm";
import { format } from "@formkit/tempo";
import Testcase from "../components/Testcase.vue";
import {
  getTestcaseTectypeLabel,
  getTestcasePytypeLabel,
} from "../lib/shared/dropdowns";
import { MODAL_PROPS } from "../lib/shared/constants";

const isVisible = ref(false);
const confirm = useConfirm();
const dialog = useDialog();
const en_name = "Testcase";
const ens_name = "Testcases";

onMounted(() => {
  ens.init();
});

const showForm = (id) => {
  let header = "Create " + en_name;
  if (id) header = "Update " + en_name;
  const dialogRef = dialog.open(Testcase, {
    data: {
      id: id,
    },
    props: { ...MODAL_PROPS, header: header },
    onCancel: (e) => {
      console.log(e);
    },
  });
};

const confirmDelete = (event, en) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete?",
    header: "Confirmation",
    accept: () => {
      ens.remove(en.$id);
    },
    onShow: () => {
      isVisible.value = true;
    },
    onHide: () => {
      isVisible.value = false;
    },
  });
};

function create() {
  showForm();
}

function formatDate(date) {
  return format(new Date(date), { date: "medium", time: "medium" });
}
</script>

<template>
  <section v-if="ens.current">
    <ConfirmPopup />
    <DataTable :value="ens.current" dataKey="$id" tableStyle="min-width: 50rem">
      <Column field="title" header="Testcase-Name"></Column>
      <Column field="testexecutions.length" header="Executions"></Column>
    </DataTable>
  </section>
</template>

<style scoped>
Button {
  margin-right: 20px;
}
</style>
