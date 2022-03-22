import mongoose from "mongoose";

const stationStaticsSchema = new mongoose.Schema({
    laneNumber: {
        type: Number,
        unique: true,
        required: true,
        min: 1,
    },
    participant: String,
    category: String,
    dynamics: {
        appVersion: String,
        state: Number,
        currentWodPosition: {
            block: Number,
            round: Number,
            movement: Number,
            reps: Number,
            repsPerBlock: { type: [Number], default: undefined },
            repsOfMovement: Number,
            totalRepsOfMovement: Number,
            currentMovement: String,
            nextMomevementReps: Number,
            nextMovement: String,
        },
        measurements: {
            type: Map,
            of: {
                value: Number,
                type: String,
                shortcut: Boolean,
            },
        },
        result: String,
    },
});

stationStaticsSchema.methods = {
    reset: async function () {
        const oldAppVersion = this.dynamics.appVersion;
        this.dynamics = { appVersion: oldAppVersion, state: 0 };
    },
};

export default mongoose.model("StationStatics", stationStaticsSchema);
