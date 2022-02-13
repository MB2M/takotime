import BaseLiveWod from "./BaseLiveWod.js";
import {State} from "../../libs/State.js"

class ForTime extends BaseLiveWod{
    getRank() {
        const stations: Station[] = this.db.getObject("/stations");
        let repList: number[] = [];
        let timeList: number[] = [];
        let stationRanked = {};
        stations.forEach((s) => {
            s.finish ? timeList.push(s.time) : repList.push(s.reps);
        });

        stations.forEach((s) => {
            let count = 0;
            if (s.finish) {
                for (let i = 0; i < timeList.length; i++) {
                    if ((timeList[i] || "") < s.time) {
                        count++;
                    }
                }
            } else {
                count = count + timeList.length;
                for (let i = 0; i < repList.length; i++) {
                    if ((repList[i] || 0) > s.reps) {
                        count++;
                    }
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

    start(options:Options): void {
        this.db.push("/globals/duration", options.duration);
        this.db.push("/globals/startTime", options.startTime);

        this.updateState(State.Cooldown);
        this.launchTimer(options.duration, options.startTime);

        this.emit("wodCooldown", options.startTime, options.duration);
    }
}

export default ForTime