<template>
    <label v-show="!drawed" ref="label"
        class="absolute text-white text-xs bg-white/30 px-2 py-1 rounded z-50 select-none"
        :style="{ transform: `translate(${_x1.x}px,${_x1.y - 30}px)` }">{{Math.abs(capture.w) }} * {{ Math.abs(capture.h) }}</label>
    <canvas id="area" ref="area" :class="{ 'cursor-move': inside }" @mouseup.left.stop="up" @mouseup.right.stop="cancel"
        @mousedown.left="down" @mousemove="move" class="absolute z-20" :width="dimensions.w" :height="dimensions.h"></canvas>
    <!-- <div class="absolute w-52 h-16 text-white">{{ _x1 }}</div> -->
</template>

<script setup lang="ts">
import useMPSC from '@renderer/composable/useMPSC';
import useScope from '@renderer/composable/useScope';
import ImageService from "@renderer/service/Image";
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const { capture, down, move, up, reset, drawed } = useScope();
const { inside, _x1 } = useMPSC()

const area = ref<HTMLCanvasElement | null>(null)

const img = await ImageService.generateImage(props.modelValue);

const dimensions = computed(() => {
    const size = inject<ScreenSize>("SIZE")

    return {
        w: size!.width,
        h: size!.height
    }
})


const draw = async (canvas: CanvasRenderingContext2D, area: { x: number, y: number, w: number, h: number }) => {
    const { x, y, w, h } = area;
    canvas.clearRect(0, 0, dimensions.value.w, dimensions.value.h)
    canvas.beginPath();
    const pattern = canvas.createPattern(img, "no-repeat")!;
    canvas.fillStyle = pattern;
    canvas.fillRect(x, y, w, h)
    canvas.closePath();
}

watch(capture, (newValue) => {
    draw(area.value!.getContext("2d")!, newValue)
});

const cancel = async () => {
    emit("update:modelValue", null)
    await window.api.cancel()
}

onMounted(() => {
    area.value!.addEventListener("drag", (e: DragEvent) => {
        console.log(e);
    })
})

onUnmounted(() => reset())
</script>