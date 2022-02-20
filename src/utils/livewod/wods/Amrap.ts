import BaseLiveWod from "./BaseLiveWod.js";
import { State } from "../../libs/State.js";

class Amrap extends BaseLiveWod {
    getRank() {
        const stations: Station[] = this.db.getObject("/stations");
        let stationRanked = {};

        stations.forEach((s) => {
            let count = 0;
            for (let i = 0; i < stations.length; i++) {
                if ((stations[i] || 0) > s.reps) {
                    count++;
                }
            }
            stationRanked = { ...stationRanked, [s.lane_number]: count + 1 };
        });

        return stationRanked;
    }

    update(message: WodData): void {
        const index = this.db.getIndex(
            "/stations",
            message.lane_number,
            "lane_number"
        );
        this.db.push(`/stations[${index}]/reps`, message.reps);
        this.db.push(`/stations[${index}]/finish`, message.finish);
        this.db.push(`/stations[${index}]/time`, message.time);
    }

    start(options: Options): void {
        this.db.push("/globals/duration", options.duration);
        this.db.push("/globals/startTime", options.startTime);

        this.updateState(State.Cooldown);
        this.launchTimer(options.duration, options.startTime);

        this.emit("wodCooldown", options.startTime, options.duration);
    }
}

export default Amrap;
