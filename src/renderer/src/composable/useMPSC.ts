import { reactive, ref } from "vue";

type ICapture = {
    x: number;
    y: number;
    w: number;
    h: number;
}
type ICoordinate = {
    x: number,
    y: number,
}

//计算鼠标位置是否在截图区域内
const inside = ref(false);
const _x1 = reactive({ x: 0, y: 0 });
const _x2 = reactive({ x: 0, y: 0 });

export default () => {

    const getBoundary = (capture: ICapture): { x1: ICoordinate, x2: ICoordinate } => {
        let x1 = { x: 0, y: 0 }
        let x2 = { x: 0, y: 0 }

        if (capture.w < 0 && capture.h > 0) {
            x1 = { x: capture.x + capture.w, y: capture.y }
            x2 = { x: capture.x, y: capture.y + capture.h }
        } else if (capture.w < 0 && capture.h < 0) {
            x1 = { x: capture.x + capture.w, y: capture.y + capture.h }
            x2 = { x: capture.x, y: capture.y }
        } else if (capture.w > 0 && capture.h < 0) {
            x1 = { x: capture.x, y: capture.y + capture.h }
            x2 = { x: capture.x + capture.w, y: capture.y }
        } else {
            x1 = { x: capture.x, y: capture.y }
            x2 = { x: capture.x + capture.w, y: capture.y + capture.h }
        }
        return { x1, x2 }
    }

    const compute = (mousePositoion: ICoordinate, capture: ICapture) => {

        //获取左上角和右下角的坐标
        const { x1, x2 } = getBoundary(capture);
        Object.assign(_x1, x1);
        Object.assign(_x2, x2);

        if ((mousePositoion.x > x1.x && mousePositoion.x < x2.x) && (mousePositoion.y > x1.y && mousePositoion.y < x2.y)) {
            //在区域内
            inside.value = true
        } else {
            //不在区域内
            inside.value = false
        }
        //取消截图时
        if (Object.entries(capture).map(([, value]) => value).every((i) => i === 0)) {
            inside.value = false
        }
    }

    return { inside, compute, _x1, _x2 }
}
