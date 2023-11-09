import WithTimeScoreService from "./withTimeMeasurement";
import { ClassicMeasurementRecord } from "./schemas/records";
import { record } from "zod";

class Classic

    // <
    //     T extends LiveScoreType
    // >
    extends WithTimeScoreService<ClassicMeasurementRecord>
{
    readonly _type = "classic";
    // ,BaseScoreConfig<T>
    // validateRecord(record: LiveScoreClassicRecord): boolean {
    //     const totalReps = this.getTotalRoundReps(record.round) + +record.value;
    //
    //     if ("minReps" in this.config) {
    //         return (
    //             totalReps >= this.config.minReps &&
    //             totalReps <= this.config.maxReps
    //         );
    //     }
    //
    //     return totalReps >= 0;
    // }

    getTotalRoundReps(round: number) {
        return this._records
            .filter((record) => record.round === round)
            .reduce((total, record) => total + +record.value, 0);
    }

    public getTotalReps() {
        return this._records.reduce(
            (total, record) => total + +record.value,
            0
        );
    }
}

export default Classic;
