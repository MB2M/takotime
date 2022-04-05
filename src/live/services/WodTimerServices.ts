import EventEmitter from "events";
import { State } from "../utils/libs/State";

class WodTimerServices extends EventEmitter {
    // description: Object;
    startTime: number;
    duration: number;
    state: State;
    timeOuts: NodeJS.Timeout[];

    constructor(description?: Object, startTime = 0, duration = 0, state = 0) {
        super();
        // this.description = description;
        this.startTime = startTime;
        this.duration = duration;
        this.state = state;
        this.timeOuts = [];
    }

    setState(state: State): void {
        this.state = state;
    }

    getState(): State {
        return this.state;
    }

    resetTimer() {
        this.timeOuts?.forEach(clearTimeout);
    }

    launchTimer(duration: number, startTime: Date) {
        this.resetTimer();
        const startTiming = setTimeout(() => {
            this.setState(State.Running);
            this.emit("wodUpdate", "start");
            const finishTiming = setTimeout(() => {
                this.finish();
            }, duration * 60000);
            this.timeOuts?.push(finishTiming);
        }, startTime.getTime() - Date.now());
        this.timeOuts?.push(startTiming);
    }

    start(options: StartOptions): void {
        this.setState(State.Countdown);
        this.launchTimer(options.duration, options.startTime);
        this.emit("wodUpdate", "countdown");
    }

    finish(): void {
        this.resetTimer();
        this.setState(State.Finished);
        this.emit("wodUpdate", "finish");
    }

    reset(): void {
        this.resetTimer();
        this.setState(State.Loaded);
        this.emit("wodUpdate", "reset");
    }
}

export default WodTimerServices;
