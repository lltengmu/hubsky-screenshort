<template>
    <canvas id="back-drop" ref="canvasEl" class="absolute z-0" :width="dimensions.w" :height="dimensions.h"></canvas>
</template>

<script setup lang="ts">
import ImageService from '@renderer/service/Image'
import { useAppStore } from '@renderer/store/useAppStore'
import { onMounted, ref } from 'vue'

const props = defineProps(['modelValue'])

const { dimensions } = useAppStore()

const canvasEl = ref<HTMLCanvasElement>()

const img = await ImageService.generateImage(props.modelValue)

const draw = async (canvas: CanvasRenderingContext2D) => {
    canvas.beginPath()
    const pattern = canvas.createPattern(img, 'no-repeat')!
    canvas.fillStyle = pattern
    canvas.fillRect(0, 0, dimensions.w, dimensions.h)
}

//捕获到屏幕之后重新绘制canvas
onMounted(() => draw(canvasEl.value!.getContext('2d')!))
</script>
