import type WodTimer from "../../lib/timer/WodTimer";
import type StationService from "./station.service";
import type { StationFactoryService } from "./stationFactory.service";
import { EventInterpreterService } from "./eventInterpreter.service";
import { EventConfig } from "../../types/LiveApp";

class EventService {
    stations: StationService[] = [];

    constructor(
        public floorId: string,
        public timer: WodTimer,
        public eventInterpreter: EventInterpreterService,
        private stationFactory: StationFactoryService
    ) {}

    station(laneNumber: number) {
        const station = this.stations.find(
            (station) => station.laneNumber === laneNumber
        );
        if (!station) throw new Error(`Station ${station} not found`);
        return station;
    }

    // setMeasurementsOnStation(
    //     measurements: Measurement[],
    //     station: StationService
    // ) {
    //     measurements.forEach((measurement) => {
    //         const score = this.scoreFactory.createScore(
    //             measurement.type,
    //             measurement.id,
    //             measurement.config
    //         );
    //         station.addMeasurement(score);
    //     });
    // }

    addStation(data: { laneNumber: number; id: string; category: string }) {
        const station = this.stationFactory.create(data);
        station.measurements = this.eventInterpreter.getMeasurements(
            station,
            this.timer
        );
        // this.setMeasurementsOnStation(measurements, station);
        this.stations.push(station);
    }

    loadEventInterpreter(eventConfigs: EventConfig[]) {
        this.eventInterpreter = new EventInterpreterService(eventConfigs);
        this.stations.forEach((station) => {
            station.deleteAllScores();
            station.measurements = this.eventInterpreter.getMeasurements(
                station,
                this.timer
            );
            // this.setMeasurementsOnStation(eventScores, station);
        });
    }

    validateAndBuzz(time: number, laneNumber: number) {
        const station = this.station(laneNumber);
        const measurementId = this.eventInterpreter.validateTime(
            time,
            station,
            this.timer.startTime
        );
        if (!measurementId) return;
        station.buzz(time, measurementId);
    }

    toJSON() {
        return {
            floorId: this.floorId,
            stations: this.stations,
            timer: this.timer,
        };
    }
}

export default EventService;
