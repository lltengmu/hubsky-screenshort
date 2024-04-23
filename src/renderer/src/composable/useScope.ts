import { computed, reactive, ref, watch } from "vue";
import useMPSC from "./useMPSC";

const { compute } = useMPSC()

const isPress = ref(false);
const capture = reactive({ x: 0, y: 0, w: 0, h: 0 });
const mousePosition = reactive({ x: 0, y: 0 })
const drawed = computed(() => Object.entries(capture).map(([, value]) => value).every((i) => i === 0))

watch(mousePosition,(newValue) => {
    //当鼠标不在按压状态时才计算
    if(!isPress.value){
        
    }
    compute(mousePosition,capture)
})

export default () => {
    const down = (e: MouseEvent) => {
        if (drawed.value) {
            isPress.value = true;
            Object.assign(capture, { x: e.pageX, y: e.pageY })
        }
    }

    const move = (e: MouseEvent) => {
        Object.assign(mousePosition, { x: e.pageX, y: e.pageY })
        if (isPress.value) {
            capture.w = e.clientX - capture.x
            capture.h = e.clientY - capture.y
        }
    }

    const up = (e: MouseEvent) => {
        if (isPress.value) {
            isPress.value = false;
        }
    }

    const reset = () => {
        Object.assign(capture, { x: 0, y: 0, w: 0, h: 0 })
    }

    return { isPress, down, move, up, reset, capture, drawed }
}