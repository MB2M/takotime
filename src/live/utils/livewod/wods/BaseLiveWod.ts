import EventEmitter from "events";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import { State } from "../../libs/State.js";

abstract class BaseLiveWod extends EventEmitter {
    db: JsonDB;
    state?: number;
    timeOuts?: NodeJS.Timeout[];
    measurements: Array<Measurement>;

    constructor(db: JsonDB) {
        super();
        this.db = db;
        this.timeOuts = [];
        this.measurements = this.getMeasurements();
    }

    updateState(state: State): void {
        this.state = state;
        this.db.push("/globals/state", state);
    }

    clearAllTimeout() {
        this.timeOuts?.forEach(clearTimeout);
    }

    launchTimer(duration: number, startTime: Date) {
        this.clearAllTimeout();
        const startTiming = setTimeout(() => {
            this.updateState(State.Running);
            this.emit("wodUpdate", "start");
            // this.emit("wodStart", startTime, duration);
            const finishTiming = setTimeout(() => {
                this.updateState(State.Finished);
                this.clearAllTimeout();
                this.emit("wodUpdate", "finish");
                // this.emit("wodFinish");
            }, duration * 60000);
            this.timeOuts?.push(finishTiming);
        }, startTime.getTime() - Date.now());
        this.timeOuts?.push(startTiming);
    }

    reset(): void {
        this.clearAllTimeout();
        const modelDB = new JsonDB(
            new Config("./modelCurrentWod.json", true, true, "/")
        );
        const modelData = modelDB.getData("/");
        this.loadWod(modelData);
    }

    loadWod(data: any): void {
        this.db.push("/", data);

        this.updateState(State.Loaded);

        this.emit("wodUpdate", "reset");
    }

    setWod(wod: any) {
        if (this.state && [1, 2].includes(this.state)) {
            throw ("Wod is running");
        }

        const modelDB = new JsonDB(
            new Config("./modelCurrentWod.json", true, true, "/")
        );
        modelDB.push("/", wod);

        this.loadWod(wod);
    }

    getMeasurements(): Measurement[] {
        let measurements: Measurement[] = [];

        for (let block of this.db.getObject<WodBlock[]>(
            "/workouts[0]/blocks"
        )) {
            if (block.measurements) {
                measurements.push(block.measurements);
            }
        }

        return measurements;
    }

    validateWod(wod: any, cb: Function) {
        if (!wod.globals) cb("wod globals missing");

        if (!wod.workouts) cb("wod workouts missing");
    }

    abstract getWodRank(): StationRanked;

    abstract update(message: WodData): void;

    abstract start(options: object): void;
}

export default BaseLiveWod;
