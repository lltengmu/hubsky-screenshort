<template>
    <Mask-vue />
    <Back-drop-vue v-if="source" v-model="source" />
    <Area-vue v-if="source" v-model="source" />
</template>

<script setup lang="ts">
import { useAppStore } from "@renderer/store/useAppStore";
import { onBeforeMount, ref } from "vue";
import AreaVue from "./Area.vue";
import BackDropVue from "./BackDrop.vue";
import MaskVue from "./Mask.vue";
import emitter from "@renderer/service/EventBus";

await useAppStore().getScreenSize()

const source = ref<string | null>(null);

const listener = async () => {
    return await new Promise(resolve => {
        window.electron.ipcRenderer.on("SCREEN:SHOW", (_event, value: string) => {
            source.value = value
            resolve(value)
        })
    })
}

emitter.on("CANCEL",(e) => source.value = e)

onBeforeMount(async () => await listener())
</script>