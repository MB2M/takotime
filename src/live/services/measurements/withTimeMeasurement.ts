import BaseMeasurementService from "./baseMeasurement";
import { ILiveTime } from "../../../types/LiveApp";

abstract class WithTimeScoreService<
    T
    // U extends { timeSize?: number }
> extends BaseMeasurementService<T> {
    //, U
    protected times: ILiveTime[] = [];
    private getTime(time: number) {
        const foundTime = this.times.find((t) => t.time === time);
        if (!foundTime) throw new Error("Time not found");
        return foundTime;
    }

    // private isMissingTimes() {
    //     return this.times.length < (this.config?.timeSize || 0);
    // }

    addTime(time: number, active: boolean = true) {
        // if (!this.config?.timeSize) {
        //     throw new Error("Time size not configured");
        // }
        // this.times.push({ time, active: this.isMissingTimes() });
        this.times.push({ time, active });
    }

    toggleTimeState(time: number) {
        const foundTime = this.getTime(time);
        foundTime.active = !foundTime.active;
    }

    getAllActiveTimes() {
        return this.times.filter((t) => t.active);
    }
}

export default WithTimeScoreService;
