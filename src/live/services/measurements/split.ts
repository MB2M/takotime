import WithTimeScoreService from "./withTimeMeasurement";
import { SplitMeasurementRecord } from "./schemas/records";

class Split
    // <
    //     T extends LiveScoreType
    // >
    extends WithTimeScoreService<SplitMeasurementRecord>
{
    readonly _type = "split";
    // , SplitScoreConfig<T>
    getTotalIndexRep(index: number, round: number) {
        return this._records
            .filter(
                (record) => record.repIndex === index && record.round === round
            )
            .reduce((total, record) => total + +record.value, 0);
    }

    getTotalRoundReps(round: number) {
        return this._records
            .filter((record) => record.round === round)
            .reduce((total, record) => total + +record.value, 0);
    }

    getTotalIndexReps(index: number) {
        return this._records
            .filter((record) => record.repIndex === index)
            .reduce((total, record) => total + +record.value, 0);
    }

    // validateRecord(record: LiveScoreSplitRecord): boolean {
    //     const repIndex = record.repIndex;
    //     const round = record.round;
    //
    //     const totalReps =
    //         this.getTotalIndexRep(repIndex, round) + +record.value;
    //
    //     if ("limits" in this.config) {
    //         const indexConfig = this.config?.limits.find(
    //             (config) => config.repIndex === repIndex
    //         );
    //         if (!indexConfig?.minReps || !indexConfig.maxReps) {
    //             return false;
    //         }
    //         return (
    //             totalReps >= indexConfig?.minReps &&
    //             totalReps <= indexConfig?.maxReps
    //         );
    //     }
    //
    //     return true;
    // }
}

export default Split;
