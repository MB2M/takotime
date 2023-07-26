import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
    laneNumber: {
        type: Number,
        required: true,
        min: 1,
    },
    participant: String,
    category: String,
    externalId: Number,
    dynamics: {
        appVersion: String,
        state: { type: Number, default: 0 },
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
            type: [
                {
                    id: Number,
                    value: Number,
                    method: String,
                    shortcut: Boolean,
                    tieBreak: {
                        value: Number,
                        method: String,
                    },
                },
            ],
            default: undefined,
        },
        result: String,
    },
});

stationSchema.methods = {
    reset: async function () {
        const oldAppVersion = this.dynamics.appVersion;
        this.dynamics = { appVersion: oldAppVersion, state: 0 };
    },
};

export default mongoose.model("Station", stationSchema);
