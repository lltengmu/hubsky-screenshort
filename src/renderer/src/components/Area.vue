<template>
    <Wah v-model="mainScope" />
    <Operation v-model="mainScope" />
    <!-- <div class="absolute border-2 border-[#3498db] top-[100px] right-0 w-52 h-16 text-white">{{ AppStore.drawMode }}</div> -->
</template>

<script setup lang="ts">
import useApp from '@renderer/composable/useApp';
import ImageService from '@renderer/service/Image';
import Operation from './widgets/Operation.vue';
import Wah from './widgets/Wah.vue';
// const AppStore = useAppStore()
const props = defineProps(['modelValue'])

const img = await ImageService.generateImage(props.modelValue)

const { mainScope } = useApp()
</script>
