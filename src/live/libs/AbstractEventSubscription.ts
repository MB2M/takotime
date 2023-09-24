import EventEmitter from "events";

abstract class AbstractEventSubscription {
    eventEmitter: EventEmitter;

    protected constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    abstract load(): void;
}

export default AbstractEventSubscription;
