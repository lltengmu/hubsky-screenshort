import MainZone from '@renderer/app/MainZone'
import drawFactory from '@renderer/service/Factory'
import { useAppStore } from '@renderer/store/useAppStore'
import { fabric } from 'fabric'
import { onMounted, onUnmounted, watch } from 'vue'

export default () => {
  const img = document.querySelector<HTMLImageElement>("img")!

  const AppStore = useAppStore()

  const mainScope = new MainZone({ w: AppStore.dimensions.w, h: AppStore.dimensions.h })

  const registerCanvasEdit = (el: HTMLCanvasElement) => {
    const backgroundImage = new fabric.Image(img, {
      cropX: mainScope.capture.x,
      cropY: mainScope.capture.y,
      width: mainScope.capture.w,
      height: mainScope.capture.h,
    })

    const canvas = new fabric.Canvas(el, { backgroundImage, selection: true })

    new Array('mouse:down', 'mouse:move', 'mouse:up').forEach((i) => canvas.off(i))

    watch(
      () => AppStore.drawMode,
      (newValue) => {
        if (newValue !== 'write') {
          canvas.isDrawingMode = false
        }
        if (newValue === 'write') {
          canvas.isDrawingMode = true
          canvas.freeDrawingBrush.color = 'red'
          canvas.freeDrawingBrush.width = 5
        }
      },
    )

    let target: fabric.Rect | fabric.Ellipse | null

    canvas.on('mouse:down', (e) => {
      if (e.target) return
      const position = canvas.getPointer(e.e)
      canvas.add((target = drawFactory(AppStore.drawMode, position)))
    })

    canvas.on('mouse:move', (e) => {
      if (!target) return
      const pointer = canvas.getPointer(e.e)
      let width = Math.abs(pointer.x - target.left!)
      let height = Math.abs(pointer.y - target.top!)

      switch (AppStore.drawMode) {
        case 'rect':
          ;(target as fabric.Rect).set({ width, height })
          break
        case 'circle':
          ;(target as fabric.Ellipse).set({ rx:width / 2,ry:height / 2 })
          break
      }
    })

    canvas.on('mouse:up', () => (target = null))
  }

  watch(mainScope.isActive, (newValue) => {
    if (newValue) {
      mainScope.liStyle()
    } else {
      mainScope.setUpEditCanvas()
      registerCanvasEdit(mainScope.edit)
    }
  })

  onMounted(() => {
    window.addEventListener('mousedown', mainScope.start.bind(mainScope))
    window.addEventListener('mousemove', mainScope.moving.bind(mainScope))
    window.addEventListener('mouseup', mainScope.end.bind(mainScope))
  })

  onUnmounted(() => {
    window.removeEventListener('mousedown', mainScope.start.bind(mainScope))
    window.removeEventListener('mouseup', mainScope.moving.bind(mainScope))
    window.removeEventListener('mousemove', mainScope.end.bind(mainScope))
  })

  return { mainScope }
}
