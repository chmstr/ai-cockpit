<script setup>
import { ref, toRefs, defineProps, defineEmits } from "vue";
// import Risk from "../components/Risk.vue";
import { ens as risks } from "../lib/stores/risks";
import { getById } from "../lib/shared/utils";

// Define props
const props = defineProps({
  initialData: {
    type: Object,
    required: true,
  },
});

// Create a reactive copy of initialData
const data = ref({ ...props.initialData });

// Define emit
const emit = defineEmits(["RiskRatingChangeEvent"]);

// Method to emit the custom event
const ratingChangeEvent = (event) => {
  console.log("risk.id", data.value.id);
  console.log("risk.rating", event.value);

  let u = { $id: data.value.id, rating: event.value };
  risks.updatePlain(u);
  //   let risk = getById(risks.current, data.value.id);
  //   risk.rating = event.value;

  //   emit("RiskRatingChangeEvent", {
  //     id: data.value.id,
  //     rating: event.value,
  //   });
};
</script>

<template>
  <div>
    <Rating v-model="data.rating" :stars="5" @change="ratingChangeEvent" />
  </div>
</template>
