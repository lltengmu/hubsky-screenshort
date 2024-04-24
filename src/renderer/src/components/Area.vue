<template>
    <WAH />
    <canvas id="area" ref="area" :class="{ 'cursor-move': inside }" @mouseup.left="up" @mouseup.right.stop="cancel()"
        @mousedown.left="down" @mousemove="move" class="absolute z-20" :width="dimensions.w"
        :height="dimensions.h"></canvas>
    <Operation />
    <!-- <div class="absolute right-0 w-52 h-16 text-white">{{ _x1 }}--{{ _x2 }}</div> -->
</template>

<script setup lang="ts">
import useDrag from '@renderer/composable/useDrag';
import useMPSC from '@renderer/composable/useMPSC';
import useScope from '@renderer/composable/useScope';
import ImageService from "@renderer/service/Image";
import { useAppStore } from '@renderer/store/useAppStore';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Operation from './widgets/Operation.vue';
import WAH from './widgets/Wah.vue';
import { draw } from '@renderer/service/draw';

const props = defineProps(["modelValue"]);

const { inside, _x1, _x2 } = useMPSC();
const { dimensions, cancel } = useAppStore();
const { down, move, up, resetScopeState } = useScope();
const { dragDown, dragMove, dragUp, resetDragState } = useDrag();

const area = ref<HTMLCanvasElement | null>(null)

const img = await ImageService.generateImage(props.modelValue);

watch([_x1, _x2], (newValue) => {
    const [x1, x2] = newValue;
    draw(img, area.value!.getContext("2d")!, { x: x1.x, y: x1.y, w: x2.x - x1.x, h: x2.y - x1.y }, dimensions)
})

const reset = () => {
    resetScopeState();
    resetDragState();
}

const handleDragMove = (e) => dragMove(e, dimensions)

onMounted(() => {
    document.body.addEventListener("mousedown", dragDown)
    document.body.addEventListener("mouseup", dragUp)
    document.body.addEventListener("mousemove", handleDragMove)
})

onUnmounted(() => {
    reset()
    document.body.removeEventListener("mousedown", dragDown)
    document.body.removeEventListener("mouseup", dragUp)
    document.body.removeEventListener("mousemove", handleDragMove)
})
</script>