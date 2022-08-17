import EventEmitter from "events";

abstract class AbstractEventsubscription {
    eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    abstract load(): void;
}

export default AbstractEventsubscription;
