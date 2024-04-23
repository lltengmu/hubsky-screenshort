import { reactive, ref } from "vue";
import useScope from "./useScope";

const isPress = ref(false);
const downPosition = reactive({ x: 0, y: 0 });
const dragOffset = reactive({ x: 0, y: 0 });
const tempOrigin = reactive({ x: 0, y: 0 });

export default () => {

    const dragDown = (e: MouseEvent) => {
        
    }

    const dragMove = (e: MouseEvent) => {
        if (isPress.value) {}
    }

    const dragUp = (e: MouseEvent) => {
        if (isPress.value) {
            isPress.value = false;
        }
    }
    
    const dragMouseOut = (e: MouseEvent) => {
        console.log("dragMouseOut");
        if (isPress.value) {
            isPress.value = false;
            // reset()
        }
    }

    const reset = () => {
        Object.assign(downPosition, { x: 0, y: 0 });
        Object.assign(dragOffset, { x: 0, y: 0 });
        Object.assign(tempOrigin, { x: 0, y: 0 });
    }

    return { dragDown, dragMove, dragUp, dragMouseOut,tempOrigin }
}