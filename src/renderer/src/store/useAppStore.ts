import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import emitter from '@renderer/service/EventBus';

export const useAppStore = defineStore('App', () => {
    
    const size = reactive({ width: 0, height: 0 });

    const getScreenSize = async () => {
        const res = await window.api.initialize();
        Object.assign(size, res)
    }

    const dimensions = computed(() => {
        return {
            w: size.width,
            h: size.height
        }
    })

    const cancel = async () => {
        emitter.emit("CANCEL",null);
        await window.api.cancel()
    }

    return { getScreenSize, dimensions,cancel }
})