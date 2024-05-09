import { Check, Close, DownloadFour, Pin, RectangleOne, Round, WritingFluently } from '@icon-park/vue-next'
import { Icon } from '@icon-park/vue-next/lib/runtime'
import MainZone from '@renderer/app/MainZone'
import { useAppStore } from '@renderer/store/useAppStore'
import { Ref, ref } from 'vue'

type IOpts = {
  name: string
  icon: Icon
  size: number
  active: Ref<boolean>
  fill: string
  theme: string
  click: () => void
}

export default (modelValue: MainZone) => {
  const { setType } = useAppStore()

  const chooseOpration = (opt: IOpts) => {
    modelValue.blur() && setTimeout(() => opt.click(), 10)
    reset(opt)
  }

  const reset = (opt: IOpts) => {
    Oprations.forEach((item) => (item.active.value = false))
    opt.active.value = true
  }

  const Oprations = [
    {
      name: 'rect',
      icon: RectangleOne,
      size: 21,
      active: ref(false),
      fill: '#333',
      theme: 'outline',
      click: function () {
        setType(this.name)
      },
    },
    {
      name: 'circle',
      icon: Round,
      size: 21,
      active: ref(false),
      fill: '#333',
      theme: 'outline',
      click: function () {
        setType(this.name)
      },
    },
    {
      name: 'write',
      icon: WritingFluently,
      size: 21,
      active: ref(false),
      fill: '#333',
      theme: 'outline',
      click: function () {
        setType(this.name)
      },
    },
    { name: 'nail', icon: Pin, size: 21, active: ref(false), fill: '#333', theme: 'outline', click: () => {} },
    {
      name: 'download',
      icon: DownloadFour,
      size: 21,
      active: ref(false),
      fill: '#333',
      theme: 'outline',
      click: async () => {
        const url = document.querySelector<HTMLCanvasElement>(`#edit-canvas`)!.toDataURL('image/jpeg')
        const res = await window.api.save(url)
        if (res.status == 'success') modelValue.cancel()
      },
    },
    { name: 'check', icon: Check, size: 21, active: ref(false), fill: '#333', theme: 'outline', click: () => {} },
    {
      name: 'close',
      icon: Close,
      size: 21,
      active: ref(false),
      fill: '#333',
      theme: 'outline',
      click: () => modelValue.cancel(),
    },
  ]

  return {
    Oprations,
    chooseOpration,
  }
}
