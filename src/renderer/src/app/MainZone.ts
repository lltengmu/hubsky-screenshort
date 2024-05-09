import emitter from '@renderer/service/EventBus'
import MPSC from '@renderer/service/MPSC'
import { draw } from '@renderer/service/draw'
import { nanoid } from 'nanoid'
import { computed, reactive, ref, watch } from 'vue'

export default class MainZone {
  public id = nanoid()

  public isPress = false
  public isActive = ref(false)

  public stretch = reactive<Record<'active' | 'target', keyof typeof this.setUpPoint | boolean>>({
    active: false,
    target: 'rightBottom',
  })

  public capture = reactive({ x: 0, y: 0, w: 0, h: 0 })

  public drawed = computed(() => {
    return Object.entries(this.capture)
      .map(([, value]) => value)
      .every((i) => i === 0)
  })

  public canvas = document.createElement('canvas')
  public edit = document.createElement('canvas')
  protected ul = document.createElement('ul')

  public _x1 = computed(() => MPSC.getBoundary(this.capture).x1)
  public _x2 = computed(() => MPSC.getBoundary(this.capture).x2)

  protected borderColor: string = '#3498db'
  protected borderWidth: number = 2

  protected app = document.querySelector('#app')!

  protected flag = { x1: { x: 0, y: 0 }, x2: { x: 0, y: 0 } }

  protected drag = { active: false, downPosition: { x: 0, y: 0 } }

  protected ulStyles = [
    'absolute',
    `border-[${this.borderWidth}px]`,
    'border-[#3498db]',
    'z-30',
    'cursor-move',
    'hidden',
    `-translate-y-[${this.borderWidth}px]`,
    `-translate-x-[${this.borderWidth}px]`,
  ]

  protected pointStyles = [
    'absolute',
    'border-[1px]',
    'border-[#3498db]',
    'rounded-full',
    'w-2',
    'h-2',
    'bg-white',
    '-translate-x-1/2',
    '-translate-y-1/2',
  ]

  protected setUpPoint = {
    [`${this.id}-leftTop`]: {
      id: `${this.id}-leftTop`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-0', 'top-0', 'cursor-nwse-resize'],
      event: (...args: number[]) => {
        const [x, y] = args
        this.capture.x = x
        this.capture.y = y
        this.capture.w = this.flag.x2.x - this.flag.x1.x + (this.flag.x1.x - x)
        this.capture.h = this.flag.x2.y - this.flag.x1.y + (this.flag.x1.y - y)
      },
    },
    [`${this.id}-leftCenter`]: {
      id: `${this.id}-leftCenter`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-0', 'top-[50%]', 'cursor-ew-resize'],
      event: (...args: number[]) => {
        const [x] = args
        this.capture.x = x
        this.capture.w = this.flag.x2.x - this.flag.x1.x + (this.flag.x1.x - x)
      },
    },
    [`${this.id}-leftBottom`]: {
      id: `${this.id}-leftBottom`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-0', 'top-[100%]', 'cursor-nesw-resize'],
      event: (...args: number[]) => {
        const [x, y] = args
        this.capture.x = x
        this.capture.w = this.flag.x1.x - x + (this.flag.x2.x - this.flag.x1.x)
        this.capture.h = this.flag.x2.y - this.flag.x1.y + (y - this.flag.x2.y)
      },
    },
    [`${this.id}-centerTop`]: {
      id: `${this.id}-centerTop`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[50%]', 'top-0', 'cursor-ns-resize'],
      event: (...args: number[]) => {
        const [, y] = args
        this.capture.y = y
        this.capture.h = this.flag.x2.y - y
      },
    },
    [`${this.id}-center`]: {
      id: `${this.id}-center`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[50%]', 'top-[50%]', 'cursor-nwse-resize', 'hidden'],
      event: (...args: number[]) => {
        return args
      },
    },
    [`${this.id}-centerBottom`]: {
      id: `${this.id}-centerBottom`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[50%]', 'top-[100%]', 'cursor-ns-resize'],
      event: (...args: number[]) => {
        const [, y] = args
        this.capture.h = y - this.capture.y
      },
    },
    [`${this.id}-rightTop`]: {
      id: `${this.id}-rightTop`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[100%]', 'top-0', 'cursor-nesw-resize'],
      event: (...args: number[]) => {
        const [x, y] = args
        this.capture.w = x - this.flag.x1.x
        this.capture.h = this.flag.x2.y - y
        this.capture.y = y
      },
    },
    [`${this.id}-rightCenter`]: {
      id: `${this.id}-rightCenter`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[100%]', 'top-[50%]', 'cursor-ew-resize'],
      event: (...args: number[]) => {
        const [x] = args
        this.capture.w = x - this.capture.x
      },
    },
    [`${this.id}-rightBottom`]: {
      id: `${this.id}-rightBottom`,
      el: document.createElement('li'),
      classList: [...this.pointStyles, 'left-[100%]', 'top-[100%]', 'cursor-nwse-resize'],
      event: (...args: number[]) => {
        const [x, y] = args
        this.capture.w = x - this.capture.x
        this.capture.h = y - this.capture.y
      },
    },
  }

  protected pointsIds = computed(() => {
    return Object.entries(this.setUpPoint).map(([key]) => key)
  })

  constructor(protected dimensions: { w: number; h: number }) {
    const img = document.querySelector<HTMLImageElement>('img')!
    this.setUpCanvas()
    this.setUpUl()

    watch([this._x1, this._x2], (newValue) => {
      const [x1, x2] = newValue
      this.setUlStyle(x1, x2)
      draw(
        img,
        this.canvas.getContext('2d')!,
        { x: x1.x, y: x1.y, w: x2.x - x1.x, h: x2.y - x1.y },
        { w: dimensions.w, h: dimensions.h },
      )
    })
  }

  setUpEditCanvas() {
    this.edit.id = 'edit-canvas'
    this.edit.classList.add(...['absolute', 'z-40'])
    this.edit.width = this.capture.w
    this.edit.height = this.capture.h
    this.ul.appendChild(this.edit)
  }

  setUpCanvas() {
    this.canvas.id = 'area'
    this.canvas.classList.add(...['absolute', 'z-20'])
    this.canvas.width = this.dimensions.w
    this.canvas.height = this.dimensions.h
    this.canvas.addEventListener('contextmenu', () => this.cancel())
    this.app.appendChild(this.canvas)
  }

  cancel() {
    this.canvas.remove()
    this.ul.remove()
    this.edit.remove()
    emitter.emit('CANCEL', undefined)
    window.api.cancel()
  }

  blur() {
    this.isActive.value = false
    Object.entries(this.setUpPoint)
      .map(([, value]) => value)
      .map((k) => k.el)
      .forEach((k) => (k.style.display = 'none'))
    this.ul.classList.remove('cursor-move')
    return true
  }
  setUlStyle<T extends { x: number; y: number }>(x1: T, x2: T): void {
    this.ul.style.left = x1.x + 'px'
    this.ul.style.top = x1.y + 'px'
    this.ul.style.width = Math.abs(x2.x - x1.x) + 'px'
    this.ul.style.height = Math.abs(x2.y - x1.y) + 'px'
    this.ul.style.display = 'block'
  }

  setUpUl() {
    this.ul.id = this.id
    this.ul.classList.add(...this.ulStyles)
    this.ul.addEventListener('mousedown', this.dragDown.bind(this))
    this.ul.addEventListener('mousemove', this.dragMove.bind(this))
    this.ul.addEventListener('mouseup', this.dragUp.bind(this))
    this.ul.addEventListener('mouseout', this.dragUp.bind(this))
    this.app.appendChild(this.ul)
  }

  liStyle() {
    const lis = Object.entries(this.setUpPoint).map(([, value]) => value)

    lis.forEach((item) => {
      item.el.id = item.id
      item.el.classList.add(...item.classList)
      this.ul.appendChild(item.el)
    })

    window.addEventListener('mousedown', this.stretchDown.bind(this))
    window.addEventListener('mousemove', this.stretchMove.bind(this))
    window.addEventListener('mouseup', this.stretchUp.bind(this))
  }
  start(e: MouseEvent) {
    const id = (e.target as HTMLElement).id
    if (id === 'area' && e.button === 0 && this.drawed.value) {
      this.isPress = true
      this.capture.x = e.pageX
      this.capture.y = e.pageY
    }
  }

  moving(e: MouseEvent) {
    if (this.isPress) {
      this.capture.w = e.clientX - this.capture.x
      this.capture.h = e.clientY - this.capture.y
    }
  }

  end() {
    if (this.isPress) {
      //修改状态
      this.isPress = false
      this.isActive.value = true
      //选择区域之后记录左上角坐标点
      Object.assign(this.flag.x1, MPSC.getBoundary(this.capture).x1)
      Object.assign(this.flag.x2, MPSC.getBoundary(this.capture).x2)

      this.capture.x = this.flag.x1.x
      this.capture.y = this.flag.x1.y
      if (this.capture.w < 0) {
        this.capture.w = Math.abs(this.capture.w)
      }

      if (this.capture.h < 0) {
        this.capture.h = Math.abs(this.capture.h)
      }
    }
  }

  dragDown(e: MouseEvent) {
    const id = (e.target as HTMLElement).id
    if (id === this.id && e.button === 0 && !this.drag.active) {
      this.drag.active = true
      Object.assign(this.drag.downPosition, { x: e.pageX, y: e.pageY })
    }
  }

  dragMove(e: MouseEvent) {
    if (e.button === 0 && this.drag.active && this.isActive.value) {
      const moveX = this.flag.x1.x + (e.pageX - this.drag.downPosition.x)
      const moveY = this.flag.x1.y + (e.pageY - this.drag.downPosition.y)
      //控制x方向的移动
      if (moveX < 0) {
        this.capture.x = 0
      } else if (moveX + this.capture.w > this.dimensions.w) {
        this.capture.x = this.dimensions.w - this.capture.w
      } else {
        this.capture.x = moveX
      }

      //控制Y方向的移动
      if (moveY < 0) {
        this.capture.y = 0
      } else if (moveY + this.capture.h > this.dimensions.h) {
        this.capture.y = this.dimensions.h - this.capture.h
      } else {
        this.capture.y = moveY
      }
    }
  }

  dragUp(e: MouseEvent) {
    if (e.button === 0 && this.drag.active && this.isActive.value) {
      //修改拖拽状态为false
      this.drag.active = false
      this.isActive.value = true
      //移动截图区域之后记录重新记录左上角和右下角的坐标点
      Object.assign(this.flag.x1, MPSC.getBoundary(this.capture).x1)
      Object.assign(this.flag.x2, MPSC.getBoundary(this.capture).x2)
    }
  }

  stretchDown(e: MouseEvent) {
    const target = (e.target as HTMLElement).id as keyof typeof this.setUpPoint as string
    if (this.pointsIds.value.includes(target) && e.button === 0 && !this.stretch.active) {
      this.stretch.target = target
      this.stretch.active = true
    }
  }

  stretchMove(e: MouseEvent) {
    if (e.button === 0 && this.stretch.active) {
      this.stretchStrategy(this.stretch.target as keyof typeof this.setUpPoint, e.pageX, e.pageY)
    }
  }

  stretchUp(e: MouseEvent) {
    if (e.button === 0 && this.stretch.active) {
      this.stretch.active = false

      //拉伸截图区域之后记录重新记录左上角和右下角的坐标点
      Object.assign(this.flag.x1, MPSC.getBoundary(this.capture).x1)
      Object.assign(this.flag.x2, MPSC.getBoundary(this.capture).x2)

      this.capture.x = this.flag.x1.x
      this.capture.y = this.flag.x1.y
      if (this.capture.w < 0) {
        this.capture.w = Math.abs(this.capture.w)
      }
      if (this.capture.h < 0) {
        this.capture.h = Math.abs(this.capture.h)
      }
    }
  }

  stretchOut(e: MouseEvent) {
    if (e.button === 0 && this.stretch.active) {
      this.stretch.active = false
    }
  }

  stretchStrategy(key: keyof typeof this.setUpPoint, x: number, y: number) {
    return this.setUpPoint[key].event.call(this, x, y)
  }

  remove() {
    this.ul.remove()
  }
}
