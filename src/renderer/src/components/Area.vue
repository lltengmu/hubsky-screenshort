<template>
    <canvas id="area" ref="area" class="absolute z-20" :width="dimensions.w" :height="dimensions.h"
        @mousemove="move($event)" @mousedown="down($event)" @mouseup.left="up($event)" @mousedown.right="cancel">
    </canvas>
    <!-- <div class="w-10 h-10 absolute bg-red-500">{{ isPress }}</div> -->
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{ source: string }>()

const isPress = ref(false)

const area = ref<HTMLCanvasElement | null>(null)

const capture = ref({
    x: 0,
    y: 0,
    w: 0,
    h: 0
})

const dimensions = computed(() => {
    const size = inject<ScreenSize>("SIZE")

    return {
        w: size!.width,
        h: size!.height
    }
})

const resetCapture = () => {
    for (const key in capture.value) {
        capture.value[key] = 0
    }
}

const clearCanvas = () => {
    document.querySelector<HTMLCanvasElement>("#back-drop")!.getContext("2d")!.clearRect(0, 0, dimensions.value.w, dimensions.value.h);
    document.querySelector<HTMLCanvasElement>("#area")!.getContext("2d")!.clearRect(0, 0, dimensions.value.w, dimensions.value.h);
}

const Redraw = () => {
    resetCapture();
    clearCanvas();
}

const cancel = async () => {
    Redraw()
    isPress.value = false
    await window.api.cancel()
}

const generateImage = (source: string): Promise<HTMLImageElement> => {
    return new Promise(resolve => {
        const img = new Image();
        img.src = source;
        img.onload = () => {
            resolve(img)
        }
    })
}

const draw = async (canvas: CanvasRenderingContext2D, source: string, area: { x: number, y: number, w: number, h: number }) => {
    const { x, y, w, h } = area;
    canvas.clearRect(0, 0, dimensions.value.w, dimensions.value.h)
    //绘制镂空区域
    canvas.beginPath();
    const img = await generateImage(source);
    const pattern = canvas.createPattern(img, "no-repeat")!;
    canvas.fillStyle = pattern;
    canvas.fillRect(x, y, w, h)
    canvas.closePath();
}

const down = (event: MouseEvent) => {
    isPress.value = !isPress.value;
    Object.assign(capture.value, { x: event.offsetX, y: event.offsetY })
}

const move = (event: MouseEvent) => {
    if (isPress.value && area.value) {
        Object.assign(capture.value, { w: event.offsetX - capture.value.x, h: event.offsetY - capture.value.y })
        draw(area.value!.getContext("2d")!, props.source, capture.value)
    }
}

const up = (event: MouseEvent) => {
    isPress.value = !isPress.value;
    Object.assign(capture.value, { w: event.offsetX - capture.value.x, h: event.offsetY - capture.value.y })
}

onMounted(() => { })
onUpdated(() => Redraw())
</script>