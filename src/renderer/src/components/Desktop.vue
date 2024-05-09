<template>
    <Mask-vue />
    <Back-drop-vue v-if="source" v-model="source" />
    <Area-vue v-if="source" v-model="source" />
    <img :src="source" class="absolute hidden" alt="back-drop-img">
</template>

<script setup lang="ts">
import emitter from '@renderer/service/EventBus'
import { useAppStore } from '@renderer/store/useAppStore'
import { onBeforeMount, ref } from 'vue'
import AreaVue from './Area.vue'
import BackDropVue from './BackDrop.vue'
import MaskVue from './Mask.vue'

await useAppStore().getScreenSize()

const source = ref<string | undefined>(undefined)

const listener = async () => {
    return await new Promise(() => {
        window.electron.ipcRenderer.on('SCREEN:SHOW', (_event, value: string) => {
            source.value = value
        })
    })
}

emitter.on('CANCEL', (e) => (source.value = e))

onBeforeMount(async () => await listener())
</script>
