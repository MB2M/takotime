import EventEmitter from "events";
import { TimerState } from "../../live/libs/TimerState";

class WodTimer extends EventEmitter {
    private startTime?: number;
    private duration = 0;
    private elapsed = 0;
    private state: TimerState = TimerState.Loaded;
    private timeOuts: NodeJS.Timeout[] = [];

    constructor() {
        super();
    }

    private setState(state: TimerState): void {
        this.state = state;
        this.emit("state", state);
    }

    public getState(): TimerState {
        return this.state;
    }

    private resetTimeouts() {
        this.timeOuts?.forEach(clearTimeout);
    }

    public start(duration: number, countdown: number) {
        this.duration = duration;
        this.resetTimeouts();
        this.startTime = Date.now() + countdown * 1000;
        if (countdown > 0) {
            this.onCountdown();
        }
        const startTimeout = setTimeout(() => {
            this.onRunning();
        }, countdown * 1000);
        this.timeOuts?.push(startTimeout);

        const finishTimeout = setTimeout(() => {
            this.onFinish();
        }, (countdown + duration) * 1000);
        this.timeOuts?.push(finishTimeout);
    }

    pause() {
        if (!this.startTime) return;
        this.resetTimeouts();
        this.elapsed = Date.now() - this.startTime;
    }

    unpause() {
        if (this.elapsed < 0) {
            this.start(this.duration, -this.elapsed);
        } else {
            this.start(this.duration - this.elapsed, 0);
        }
    }

    reset(): void {
        this.resetTimeouts();
        this.setState(TimerState.Loaded);
    }
    private onCountdown() {
        this.setState(TimerState.Countdown);
    }

    private onRunning() {
        this.setState(TimerState.Running);
    }

    private onFinish(): void {
        this.resetTimeouts();
        this.setState(TimerState.Finished);
    }
}

export default WodTimer;
