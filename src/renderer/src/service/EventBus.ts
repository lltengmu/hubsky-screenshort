import mitt, { Emitter } from "mitt"

type Event = {
    CANCEL:undefined
}

const emitter: Emitter<Event> = mitt<Event>();

export default emitter;