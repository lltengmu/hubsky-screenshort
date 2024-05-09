class Canvas {
  protected id = 'area'
  protected classlist = ['absolute', 'z-20']
  protected app = document.querySelector('#app')!
  protected el = document.createElement('canvas')
  constructor(dimensions: { w: number; h: number }) {
    this.el.width = dimensions.w
    this.el.height = dimensions.h
    this.app.appendChild(this.el)
  }
}
