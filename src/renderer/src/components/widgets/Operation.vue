<template>
    <ul ref="opration" v-if="isEnd" class="absolute flex gap-1 text-xs rounded z-20" :style="oprationStyle">
        <li v-for="(item, i) in Oprations" :key="i" class="bg-white px-2 py-1 rounded hover:bg-violet-500 hover:cursor-pointer" @click="item.click">
            <component :is="item.icon" :size="item.size" :Theme="item.theme" :fill="item.fill" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { DownloadFour, Close } from '@icon-park/vue-next';
import useMPSC from '@renderer/composable/useMPSC';
import { computed, ref } from 'vue';
import { useAppStore } from '@renderer/store/useAppStore';
import useScope from '@renderer/composable/useScope';

const Oprations = [
    { icon: Close, size: 21, fill: "#333", theme: "outline",click:() => cancel() },
    {
        icon: DownloadFour, size: 21, fill: "#333", theme: "outline",click:async () => {
            const url = document.querySelector<HTMLCanvasElement>(`#area`)!.toDataURL("image/jpeg");
            const res = await window.api.save(url,{ x: _x1.x, y: _x1.y, w: _x2.x - _x1.x, h: _x2.y - _x1.y });
            if(res.status == "success") cancel();
        }
    },
]

const opration = ref<HTMLUListElement | null>(null);
const { _x1,_x2 } = useMPSC();
const { dimensions,cancel } = useAppStore()
const { isEnd,capture } = useScope()

const oprationStyle = computed(() => {
    let x, y;

    y = (opration.value && _x2.y > dimensions.h - opration.value!.offsetHeight) ? _x2.y - (opration.value!.offsetHeight + 10) : _x2.y + 10;

    x = opration.value ? _x2.x - opration.value!.offsetWidth : _x2.x;

    return { transform: `translate(${x}px,${y}px)` }
})
</script>