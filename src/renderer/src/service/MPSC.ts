type ICapture = {
  x: number
  y: number
  w: number
  h: number
}

type ICoordinate = {
  x: number
  y: number
}

class MPSC {
  getBoundary = <T extends ICapture>(capture: T): Record<'x1' | 'x2' | 'x3' | 'x4', ICoordinate> => {
    let x1 = { x: 0, y: 0 } //左上角坐标点
    let x2 = { x: 0, y: 0 } //右下角坐标点
    let x3 = { x: 0, y: 0 } //左下角坐标点
    let x4 = { x: 0, y: 0 } //右上角坐标点

    if (capture.w < 0 && capture.h > 0) {
      x1 = { x: capture.x + capture.w, y: capture.y }
      x2 = { x: capture.x, y: capture.y + capture.h }
      x3 = { x: capture.x + capture.w, y: capture.y + capture.h }
      x4 = { x: capture.x, y: capture.y }
    } else if (capture.w < 0 && capture.h < 0) {
      x1 = { x: capture.x + capture.w, y: capture.y + capture.h }
      x2 = { x: capture.x, y: capture.y }
      x3 = { x: capture.x + capture.w, y: capture.y }
      x4 = { x: capture.x, y: capture.y + capture.h }
    } else if (capture.w > 0 && capture.h < 0) {
      x1 = { x: capture.x, y: capture.y + capture.h }
      x2 = { x: capture.x + capture.w, y: capture.y }
      x3 = { x: capture.x, y: capture.y }
      x4 = { x: capture.x + capture.w, y: capture.y + capture.h }
    } else {
      x1 = { x: capture.x, y: capture.y }
      x2 = { x: capture.x + capture.w, y: capture.y + capture.h }
      x3 = { x: capture.x, y: capture.y + capture.h }
      x4 = { x: capture.x + capture.w, y: capture.y }
    }

    return { x1, x2, x3, x4 }
  }
}

export default new MPSC()
