<template>
    <canvas id="mask" ref="mask" class="absolute z-10" :width="dimensions.w" :height="dimensions.h"></canvas>
</template>

<script setup lang="ts">
import { useAppStore } from "@renderer/store/useAppStore";
import { onMounted, ref } from 'vue';

const mask = ref<HTMLCanvasElement | null>(null)

const { dimensions } = useAppStore()

const drawMask = (canvas: CanvasRenderingContext2D) => {
    canvas.clearRect(0, 0, dimensions.w, dimensions.h)
    canvas.save();
    canvas.beginPath();
    canvas.fillStyle = `rgba(0,0,0,.5)`;
    canvas.fillRect(0, 0, dimensions.w, dimensions.h);
    canvas.restore();
}

onMounted(() => drawMask(mask.value!.getContext("2d")!))
</script>