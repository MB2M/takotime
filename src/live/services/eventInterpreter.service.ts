import { AvailableAdapters } from "../../types/adapters";
import { EventConfig } from "../../types/LiveApp";
import ClassicAdapter from "./measurements/classicAdapter";
import StationService from "./station.service";
import Measurement from "./measurements/measurement";
import logger from "../../config/logger";
import Timer from "../../lib/timer";
import WodTimer from "../../lib/timer/WodTimer";

export class EventInterpreterService {
    measurements: Measurement[] = [];

    adapters: AvailableAdapters[] = [];

    constructor(private eventConfigs: EventConfig[]) {}

    private _addAdapter(type: EventConfig["measurements"][0]["type"]) {
        let adapter: AvailableAdapters;
        switch (type) {
            case "classic":
                adapter = new ClassicAdapter();
                this.adapters.push(adapter);
        }
        return adapter;
    }

    private _getAdapter(type: EventConfig["measurements"][0]["type"]) {
        const adapter = this.adapters.find((adapter) => adapter.tag === type);
        if (!adapter) {
            return this._addAdapter(type);
        }
        return adapter;
    }

    private _getMeasurementOfStation(station: StationService) {
        return (
            this.eventConfigs.find((measurement) =>
                measurement.categories.includes(station.category)
            )?.measurements || []
        );
    }

    getMeasurements(station: StationService, timer: WodTimer) {
        const measurements: Measurement[] = [];
        this._getMeasurementOfStation(station).forEach((measurement) => {
            const adapter = this._getAdapter(measurement.type);
            measurements.push(
                adapter.createMeasurement(
                    measurement.id,
                    measurement.config,
                    timer
                )
            );
        });

        return measurements;
    }

    validateTime(
        time: number,
        station: StationService,
        eventStartTime?: number
    ) {
        if (!eventStartTime)
            return logger.info(
                `Buzzer lane ${station.laneNumber} pressed, but event timer has not started.`
            );

        const id = this._getMeasurementOfStation(station)
            .filter(
                (measurement) =>
                    measurement.config.buzzer.active &&
                    measurement.config.buzzer.quantity > 0
            )
            .find((measurement) => {
                const syncedTimeStart =
                    measurement.config.startTime + eventStartTime;
                const syncedTimeEnd =
                    measurement.config.endTime + eventStartTime;

                return time >= syncedTimeStart && time <= syncedTimeEnd;
            })?.id;

        if (!id)
            return logger.info(
                `Buzzer lane ${station.laneNumber} pressed, but no measurement found for time ${time}.`
            );

        return id;
    }

    // validateRecord(
    //     score: BaseMeasurement<MeasurementRecord>,
    //     record: MeasurementRecord
    // ) {
    //     const measurement = this.measurements.find(
    //         (measurement) => measurement.id === score.id
    //     );
    //     if (!measurement) throw new Error(`Measurement ${score.id} not found`);
    //
    //     if (score instanceof Classic) {
    //         const parsedRecord = ClassicMeasurementRecordSchema.parse(record);
    //         const totalReps = score.getTotalReps() + +parsedRecord.value;
    //
    //         return (
    //             totalReps >= (measurement.minReps || 0) &&
    //             (!measurement.maxReps || totalReps <= measurement.maxReps)
    //         );
    //     }
    //
    //     if (score instanceof Split) {
    //         const parsedRecord = SplitMeasurementRecordSchema.parse(record);
    //
    //         const repIndex = parsedRecord.repIndex;
    //         const round = parsedRecord.round;
    //
    //         const totalReps =
    //             score.getTotalIndexRep(repIndex, round) + +parsedRecord.value;
    //
    //         const indexConfig = measurement.limits?.find(
    //             (config) => config.repIndex === repIndex
    //         );
    //
    //         return (
    //             totalReps >= (indexConfig?.minReps || 0) &&
    //             (!indexConfig?.maxReps || totalReps <= indexConfig?.maxReps)
    //         );
    //     }
    //
    //     if (score instanceof MaxWeight) {
    //         return true;
    //     }
    //
    //     return false;
    // }
}
