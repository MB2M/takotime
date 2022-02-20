import EventEmitter from "events";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import { State } from "../../libs/State.js";

abstract class BaseLiveWod extends EventEmitter {
    db: JsonDB;
    state?: number;
    timeOuts?: NodeJS.Timeout[];

    constructor(db: JsonDB) {
        super();
        this.db = db;
        this.timeOuts = [];
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
            console.log("wod start");
            this.emit("wodStart", startTime, duration);
            const finishTiming = setTimeout(() => {
                this.updateState(State.Finished);
                this.clearAllTimeout();
                console.log("wod finish");
                this.emit("wodFinish");
            }, duration * 60000);
            this.timeOuts?.push(finishTiming);
        }, startTime.getTime() - Date.now());
        this.timeOuts?.push(startTiming);
    }

    reset(): void {
        this.clearAllTimeout();
        const modelDB = new JsonDB(
            new Config("./liveconfig copy.json", true, true, "/")
        );
        const modelData = modelDB.getData("/");
        this.db.push("/", modelData);

        this.updateState(State.Loaded);

        this.emit("wodReset");
    }

    abstract getRank(): object;

    abstract update(message: WodData): void;

    abstract start(options: object): void;
}

export default BaseLiveWod;
