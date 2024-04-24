import { reactive, ref } from "vue";
import useMPSC from "./useMPSC";
import useScope from "./useScope";

const isdrag = ref(false);
const downPosition = reactive({ x: 0, y: 0 });

export default () => {
    const { capture, origin } = useScope();
    const { inside, getBoundary } = useMPSC();

    const dragDown = (e: MouseEvent) => {
        if (inside.value) {
            isdrag.value = true;
            Object.assign(downPosition, { x: e.pageX, y: e.pageY });
        }
    }

    const dragMove = (e: MouseEvent, dimensions: Record<"w" | "h", number>) => {
        if (inside.value && isdrag.value) {

            const moveX = origin.x + (e.pageX - downPosition.x);
            const moveY = origin.y + (e.pageY - downPosition.y);
            //控制x方向的移动
            if(moveX < 0){
                capture.x = 0;
            }else if(moveX + capture.w > dimensions.w){
                capture.x = dimensions.w - capture.w
            }else{
                capture.x = moveX
            }
            //控制Y方向的移动
            if(moveY < 0){
                capture.y = 0
            }else if(moveY + capture.h > dimensions.h){
                capture.y = dimensions.h - capture.h
            }else{
                capture.y = moveY
            }
        }
    }

    const dragUp = () => {
        if (isdrag.value) {
            //修改拖拽状态为false
            isdrag.value = false;
            //移动截图区域之后记录重新记录左上角的坐标点
            Object.assign(origin, getBoundary(capture).x1);
        }
    }

    const resetDragState = () => {
        isdrag.value = false;
        Object.assign(downPosition, { x: 0, y: 0 });
    }

    return { dragDown, dragMove, dragUp, isdrag, resetDragState }
}