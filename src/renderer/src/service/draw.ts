export const draw = async (
    img: HTMLImageElement,
    canvas: CanvasRenderingContext2D,
    area: { x: number, y: number, w: number, h: number },
    dimensions: { w: number, h: number }
) => {
    const { x, y, w, h } = area;
    canvas.clearRect(0, 0, dimensions.w, dimensions.h)
    canvas.beginPath();
    const pattern = canvas.createPattern(img, "no-repeat")!;
    canvas.fillStyle = pattern;
    canvas.fillRect(x, y, w, h);
    canvas.closePath();
}
