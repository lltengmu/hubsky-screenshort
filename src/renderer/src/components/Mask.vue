<template>
    <canvas id="mask" ref="mask" class="absolute z-10" :width="dimensions.w" :height="dimensions.h"></canvas>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';

const mask = ref<HTMLCanvasElement | null>(null)

const dimensions = computed(() => {
    const size = inject<ScreenSize>("SIZE")
    return {
        w: size!.width,
        h: size!.height
    }
})


const drawMask = (canvas: CanvasRenderingContext2D) => {
    canvas.clearRect(0, 0, dimensions.value.w, dimensions.value.h)
    canvas.save();
    canvas.beginPath();
    canvas.fillStyle = `rgba(0,0,0,.5)`;
    canvas.fillRect(0, 0, dimensions.value.w, dimensions.value.h);
    canvas.restore();
}

onMounted(() => drawMask(mask.value!.getContext("2d")!))
</script>