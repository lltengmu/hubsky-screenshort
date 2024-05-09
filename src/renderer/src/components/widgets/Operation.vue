<template>
    <ul ref="opration" v-if="!drawed" class="absolute flex gap-1 text-xs rounded z-40" :style="oprationStyle">
        <li v-for="(item, i) in Oprations" :key="i" class="px-2 py-1 rounded hover:bg-violet-500 hover:cursor-pointer"
            :class="[item.active.value ? 'bg-violet-500' : 'bg-white']" @click="chooseOpration(item)">
            <component :is="item.icon" :size="item.size" :Theme="item.theme" :fill="item.fill" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import MainZone from '@renderer/app/MainZone'
import { useAppStore } from '@renderer/store/useAppStore'
import { computed, ref } from 'vue'
import useOpration from '@renderer/composable/useOpration';

const { modelValue } = defineProps<{ modelValue: MainZone }>()
const { drawed } = modelValue
const opration = ref<HTMLUListElement | null>(null)
const { dimensions } = useAppStore()
const { Oprations, chooseOpration } = useOpration(modelValue)

const oprationStyle = computed(() => {
    let x, y

    y = opration.value && modelValue._x2.value.y > dimensions.h - opration.value!.offsetHeight
            ? modelValue._x2.value.y - (opration.value!.offsetHeight + 10)
            : modelValue._x2.value.y + 10

    x = opration.value ? modelValue._x2.value.x - opration.value!.offsetWidth : modelValue._x2.value.x

    return { transform: `translate(${x}px,${y}px)` }
})
</script>
