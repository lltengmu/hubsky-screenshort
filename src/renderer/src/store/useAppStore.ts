import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import emitter from '@renderer/service/EventBus'

export const useAppStore = defineStore('App', () => {
  const drawMode = ref<string>("rect")

  const size = reactive({ width: 0, height: 0 })

  const getScreenSize = async () => {
    const res = await window.api.initialize()
    Object.assign(size, res)
  }

  const dimensions = computed(() => {
    return {
      w: size.width,
      h: size.height,
    }
  })

  const setType = (value: string) => {
    drawMode.value = value
  }

  const cancel = async () => {
    emitter.emit('CANCEL', undefined)
    await window.api.cancel()
  }

  return { getScreenSize, dimensions, cancel, drawMode, setType }
})
