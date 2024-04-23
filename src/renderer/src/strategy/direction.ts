type ICoordinate = { x: number, y: number }

type IOffset = ICoordinate

export type IDirection = keyof typeof directionStrategy

const directionStrategy = {
    [`left-top-right-bottom`]: (origin: ICoordinate, offset: IOffset) => {
        return `clip:rect(${origin.y}px, ${origin.x + offset.x}px, ${origin.y + offset.y}px, ${origin.x}px)`;
    },
    [`right-top-left-bottom`]: (origin: ICoordinate, offset: IOffset) => {
        return `clip:rect(${origin.y}px, ${origin.x}px, ${origin.y + offset.y}px, ${origin.x - Math.abs(offset.x)}px)`
    },
    [`right-bottom-left-top`]: (origin: ICoordinate, offset: IOffset) => {
        return `clip:rect(${origin.y - Math.abs(offset.y)}px, ${origin.x}px, ${origin.y}px, ${origin.x - Math.abs(offset.x)}px)`
    },
    [`left-bottom-right-top`]: (origin: ICoordinate, offset: IOffset) => {
        return `clip:rect(${origin.y - Math.abs(offset.y)}px, ${origin.x + offset.x}px, ${origin.y}px, ${origin.x}px)`
    },
}

export const directionContext = (
    direction: keyof typeof directionStrategy,
    origin: ICoordinate,
    offset: IOffset
) => {
    return directionStrategy[direction].call(this, origin, offset)
}