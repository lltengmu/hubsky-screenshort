<template>
    <canvas id="back-drop" ref="canvasEl" class="absolute z-0" :width="dimensions.w" :height="dimensions.h"></canvas>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{ source: string }>()

const canvasEl = ref<HTMLCanvasElement | null>(null)

const dimensions = computed(() => {
    const size = inject<ScreenSize>("SIZE")
    return {
        w: size!.width,
        h: size!.height
    }
})

const generateImage = (source: string): Promise<HTMLImageElement> => {
    return new Promise(resolve => {
        const img = new Image();
        img.src = source;
        img.onload = () => {
            resolve(img)
        }
    })
}

const draw = async (canvas: CanvasRenderingContext2D, source: string) => {
    canvas.beginPath();
    const img = await generateImage(source);
    const pattern = canvas.createPattern(img, "no-repeat")!;
    canvas.fillStyle = pattern;
    canvas.fillRect(0, 0, dimensions.value.w, dimensions.value.h);
}

//捕获到屏幕之后重新绘制canvas
onMounted(async () => await draw(canvasEl.value!.getContext("2d")!, props.source))
onUpdated(async () => await draw(canvasEl.value!.getContext("2d")!, props.source))
</script>