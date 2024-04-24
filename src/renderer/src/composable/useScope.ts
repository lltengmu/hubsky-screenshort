import { computed, reactive, ref, watch } from "vue";
import useMPSC from "./useMPSC";

const { compute, getBoundary } = useMPSC()

const isPress = ref(false);
const capture = reactive({ x: 0, y: 0, w: 0, h: 0 });
const mousePosition = reactive({ x: 0, y: 0 });
//记录选择区域结束之后，左上角的坐标点
const origin = reactive({ x: 0, y: 0 });
const drawed = computed(() => Object.entries(capture).map(([, value]) => value).every((i) => i === 0));
const isEnd = computed(() => Object.entries(origin).map(([, value]) => value).every((i) => i !== 0));

watch(mousePosition, (newValue) => compute(newValue, capture))

export default () => {
    const down = (e: MouseEvent) => {
        if (drawed.value) {
            isPress.value = true;
            Object.assign(capture, { x: e.pageX, y: e.pageY });
        }
    }

    const move = (e: MouseEvent) => {
        Object.assign(mousePosition, { x: e.pageX, y: e.pageY })

        if (isPress.value) {
            capture.w = e.clientX - capture.x
            capture.h = e.clientY - capture.y
        }
    }

    const up = () => {
        if (isPress.value) {
            //修改状态
            isPress.value = false;
            //选择区域之后记录左上角坐标点
            Object.assign(origin, getBoundary(capture).x1);
        }
    }

    const resetScopeState = () => {
        Object.assign(capture, { x: 0, y: 0, w: 0, h: 0 });
        Object.assign(origin, { x: 0, y: 0 });
    }

    return { isPress, down, move, up, resetScopeState, capture, drawed, origin, isEnd }
}