<template>
    <label ref="label" v-show="!drawed" class="absolute text-white text-xs bg-white/30 px-2 py-1 rounded z-50 select-none" :style="labelStyle">
        {{ Math.abs(modelValue.capture.w) }} * {{ Math.abs(modelValue.capture.h) }}
    </label>
</template>

<script setup lang="ts">
import MainRect from '@renderer/app/MainZone';
import { computed } from 'vue';

const { modelValue } = defineProps<{ modelValue:MainRect }>()
const { drawed } = modelValue;

const labelStyle = computed(() => {
    const y = modelValue._x1.value.y < 30 ? modelValue._x1.value.y : modelValue._x1.value.y - 30;
    return { transform: `translate(${modelValue._x1.value.x}px,${y}px)` }
})

</script>