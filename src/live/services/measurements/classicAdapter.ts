import BaseAdapter from "./baseAdapter";
import { classicMeasurementRecordSchema } from "./schemas/records";
import { z } from "zod";
import Measurement from "./measurement";
import { classicAdapterConfigSchema } from "./schemas/adapters";
import { ILiveTime } from "../../../types/LiveApp";

type StreamData = {
    score: number;
    totalReps: number;
    times: ILiveTime[];
    records: z.infer<typeof classicMeasurementRecordSchema>[];
};

type RecordType = typeof classicMeasurementRecordSchema;
type ConfigType = typeof classicAdapterConfigSchema;

export default class ClassicAdapter extends BaseAdapter<
    RecordType,
    ConfigType,
    StreamData
> {
    readonly _tag = "classic";
    readonly _recordSchema = classicMeasurementRecordSchema;
    readonly _configSchema = classicAdapterConfigSchema;

    toStream(
        measurement: Measurement<StreamData, RecordType, ConfigType>
    ): StreamData {
        const times = measurement.getAllActiveTimes().map((time) => time.time);
        const lastTime = times.at(-1);
        const totalReps = this.getTotalReps(measurement);
        const startTime = measurement.timer.startTime || 0;

        const finalMeasure = lastTime
            ? lastTime - (startTime + measurement.config.startTime)
            : totalReps;
        return {
            score: finalMeasure,
            times: measurement.times,
            totalReps: totalReps,
            records: measurement.records,
        };
    }

    hasRequiredActiveTime(
        measurement: Measurement<StreamData, RecordType, ConfigType>
    ): boolean {
        console.log(
            measurement.config.buzzer.active &&
                measurement.config.buzzer.quantity <=
                    measurement.getAllActiveTimes().length
        );
        return measurement.config.buzzer.active
            ? measurement.config.buzzer.quantity <=
                  measurement.getAllActiveTimes().length
            : false;
    }

    validateRecord(
        measurement: Measurement<StreamData, RecordType, ConfigType>,
        record: z.infer<RecordType>
    ) {
        const totalReps = this.getTotalReps(measurement) + +record.value;
        return (
            totalReps >= (measurement.config.minReps || 0) &&
            (!measurement.config.maxReps ||
                totalReps <= measurement.config.maxReps)
        );
    }

    getTotalReps(measurement: Measurement<StreamData, RecordType, ConfigType>) {
        return measurement.records.reduce(
            (total, record) => total + +record.value,
            0
        );
    }

    // validateTime(
    //     measurement: Measurement<Score, RecordType, ConfigType>,
    //     buzzerTime: number,
    //     eventStartTime: number | null
    // ) {
    //     const { buzzer, startTime, minReps, maxReps, endTime } =
    //         measurement.config;
    //
    //     if (!buzzer.active) return false;
    //
    //     if (!eventStartTime) throw new Error(`Event has not started`);
    // }
}
