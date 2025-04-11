<script setup>
</script>

<template>
    <Button @click="props.createMethod"
            v-if="canEdit">Action ...</Button>
</template>