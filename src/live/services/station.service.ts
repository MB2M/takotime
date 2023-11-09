import Measurement from "./measurements/measurement";

class StationService {
    _measurements: Measurement[] = [];

    constructor(
        private _laneNumber: number,
        private _id: string, // eternalID of the participant for example
        private _category: string
    ) {}

    get category(): string {
        return this._category;
    }

    get laneNumber() {
        return this._laneNumber;
    }

    get id() {
        return this._id;
    }

    get measurements() {
        return this._measurements;
    }

    set measurements(measurements: Measurement[]) {
        this._measurements = measurements;
    }

    buzz(timestamp: number, measurementId: string): void {
        console.log(`Lane ${this.laneNumber} buzzed at ${timestamp}`);
        const score = this.measurement(measurementId);
        score.addTime(timestamp);
    }

    measurement(id: string) {
        const score = this._measurements.find((score) => score.id === id);
        if (!score) throw new Error(`Score ${id} not found`);

        return score;
    }

    addMeasurement(measurement: Measurement) {
        this._measurements.push(measurement);
        return measurement;
    }

    deleteAllScores() {
        this._measurements = [];
    }

    toJSON() {
        return {
            laneNumber: this.laneNumber,
            id: this.id,
            category: this.category,
            measurements: this.measurements.map((m) => m.toJSON()),
        };
    }
}

export default StationService;
