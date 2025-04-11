<script setup>
import { defineProps } from 'vue';
import { canEdit } from "../lib/stores/user";

const props = defineProps(['createMethod']);
</script>

<template>
    <Button @click="props.createMethod"
            v-if="canEdit">Create New</Button>
</template>