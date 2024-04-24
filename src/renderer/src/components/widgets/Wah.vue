<template>
    <label v-show="!drawed" ref="label" class="absolute text-white text-xs bg-white/30 px-2 py-1 rounded z-50 select-none" :style="labelStyle">
        {{ Math.abs(capture.w) }} * {{ Math.abs(capture.h) }}
    </label>
</template>

<script setup lang="ts">
import useMPSC from '@renderer/composable/useMPSC';
import useScope from '@renderer/composable/useScope';
import { computed } from 'vue';

const { capture, drawed } = useScope();
const { _x1 } = useMPSC();

const labelStyle = computed(() => {
    const y = _x1.y < 30 ? _x1.y : _x1.y - 30;
    return { transform: `translate(${_x1.x}px,${y}px)` }
})

</script>