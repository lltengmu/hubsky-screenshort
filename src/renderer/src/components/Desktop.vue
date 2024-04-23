<template>
    <Mask-vue />
    <Back-drop-vue v-if="source" :source="source" />
    <Area-vue v-if="source" v-model="source" />
</template>

<script setup lang="ts">
import { onBeforeMount, provide, reactive, ref } from "vue";
import MaskVue from "./Mask.vue";
import BackDropVue from "./BackDrop.vue";
import AreaVue from "./Area.vue";

const getScreenSize = async (): Promise<ScreenSize> => {
    return await window.api.initialize()
}

const size = await getScreenSize()

provide("SIZE", reactive(size))

const source = ref('')

const listener = async () => {
    return await new Promise(resolve => {
        window.electron.ipcRenderer.on("SCREEN:SHOW", (_event, value: string) => {
            source.value = value
            resolve(value)
        })
    })
}

onBeforeMount(async () => await listener())
</script>