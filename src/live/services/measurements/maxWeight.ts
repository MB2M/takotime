import BaseMeasurementService from "./baseMeasurement";
import { MaxWeightMeasurementRecord } from "./schemas/records";

class MaxWeight extends BaseMeasurementService<MaxWeightMeasurementRecord> {
    // ,BaseScoreConfig
    // validateRecord(record: LiveScoreMaxWeightRecord): boolean {
    //     return true;
    // }
    readonly _type = "maxWeight";
}

export default MaxWeight;
