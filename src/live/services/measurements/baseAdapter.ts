import Measurement from "./measurement";
import { z, ZodSchema } from "zod";
import WodTimer from "../../../lib/timer/WodTimer";

export default abstract class BaseAdapter<
    RecordType extends ZodSchema,
    ConfigType extends ZodSchema,
    StreamDataType
> {
    // implements MeasurementAdapterMethod<RecordType, ConfigType>
    abstract readonly _tag: string;
    abstract readonly _recordSchema: RecordType;
    abstract readonly _configSchema: ConfigType;

    get tag(): string {
        return this._tag;
    }
    get recordSchema(): ZodSchema {
        return this._recordSchema;
    }

    get configSchema(): ConfigType {
        return this._configSchema;
    }

    abstract toStream(
        measurement: Measurement<StreamDataType, RecordType, ConfigType>
    ): StreamDataType;

    abstract validateRecord(
        records: Measurement<StreamDataType, RecordType, ConfigType>,
        record: z.infer<RecordType>
    ): boolean;

    hasRequiredActiveTime(
        measurement: Measurement<StreamDataType, RecordType, ConfigType>
    ): boolean {
        return false;
    }

    // abstract validateTime(
    //     records: Measurement<ScoreType, RecordType, ConfigType>,
    //     time: number,
    //     eventStartTime: number | null
    // ): boolean;

    createMeasurement(
        id: string,
        config: z.infer<ConfigType>,
        timer: WodTimer
    ): Measurement<StreamDataType, RecordType, ConfigType> {
        return new Measurement<StreamDataType, RecordType, ConfigType>(
            id,
            this,
            config,
            timer
        );
    }
}
