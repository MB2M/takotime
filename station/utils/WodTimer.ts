import EventEmitter from "events";

class WodTimer extends EventEmitter {
    private timeOuts: NodeJS.Timeout[];
    constructor() {
        super();
        this.timeOuts = [];
    }

    async launchTimer(startTime, duration, checkpointTime) {
        console.log("START TIMER");
        const now = Date.now();
        if (now < Date.parse(startTime) + duration * 60000) {
            if (now < Date.parse(startTime)) {
                const delay = 800;
                const emitValue = "countdown";
                const values = [
                    Date.parse(startTime) / 1000 - Math.floor(now / 1000),
                ];
                const timeout = setTimeout(() => {
                    this.emit(emitValue, ...values);
                    this.launchTimer(startTime, duration, checkpointTime);
                }, delay);
                this.timeOuts.push(timeout);
            } else {
                checkpointTime.forEach((checkpoint) => {
                    const timeOut = setTimeout(() => {
                        this.emit("timeCheckpoint", checkpoint);
                    }, Date.parse(startTime) + checkpoint * 60000 - now);
                    this.timeOuts.push(timeOut);
                });
                console.log("wod started");
                this.emit("wodStarted");
                const delay = Date.parse(startTime) + duration * 60000 - now;
                const timeout = setTimeout(() => {
                    this.launchTimer(startTime, duration);
                }, delay);
                this.timeOuts.push(timeout);
            }
        } else {
            console.log("wod ended");
            this.emit("wodEnded");
        }
    }

    stopTimer() {
        this.timeOuts.forEach((t) => clearTimeout(t));
    }
}

export default WodTimer;
