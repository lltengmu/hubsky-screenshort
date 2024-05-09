import { fabric } from 'fabric'
export default (type: string, position: Record<'x' | 'y', number>): fabric.Rect | fabric.Ellipse => {
  switch (type) {
    case 'rect':
      return new fabric.Rect({
        hasBorders: false,
        left: position.x,
        top: position.y,
        fill: 'rgba(0,0,0,0)',
        width: 0,
        height: 0,
        stroke: 'red',
        strokeWidth: 2,
        strokeLineCap: 'round',
        strokeUniform:true,
        transparentCorners: false,
        cornerSize: 8,
        cornerColor: 'white',
        cornerStrokeColor: 'red',
        cornerStyle: 'circle',
        moveCursor: 'pointer',
      }).setControlVisible('mtr', false)
    case 'circle':
      return new fabric.Ellipse({
        hasBorders: true,
        left: position.x,
        top: position.y,
        fill: 'rgba(0,0,0,0)',
        stroke: 'red',
        rx:0,
        ry:0,
        strokeWidth: 2,
        strokeLineCap: 'round',
        strokeUniform:true,
        transparentCorners: false,
        cornerSize: 8,
        cornerColor: 'white',
        cornerStrokeColor: 'red',
        cornerStyle: 'circle',
        moveCursor: 'pointer',
      }).setControlVisible('mtr', false)
    default:
      return new fabric.Rect({
        hasBorders: false,
        left: position.x,
        top: position.y,
        fill: 'rgba(0,0,0,0)',
        width: 0,
        height: 0,
        stroke: 'red',
        strokeWidth: 2,
        strokeLineCap: 'round',
        strokeUniform:true,
        transparentCorners: false,
        cornerSize: 8,
        cornerColor: 'white',
        cornerStrokeColor: 'red',
        cornerStyle: 'circle',
        moveCursor: 'pointer',
      }).setControlVisible('mtr', false)
  }
}
