import mitt, { Emitter } from "mitt"

type Event = {
    CANCEL:null
}

const emitter: Emitter<Event> = mitt<Event>();

export default emitter;