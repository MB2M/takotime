import mongoose from "mongoose";

const stationDynamicsSchema = new mongoose.Schema({
    laneNumber: Number,
    appVersion: String,
    state: Number,
    currentWodPosition: {
        block: Number,
        round: Number,
        movement: Number,
        reps: Number,
        repsPerBlock: [Number],
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
});

stationDynamicsSchema.methods = {
    // authenticate: async function (password: string) {
    //     const match = await bcrypt.compare(password, this.password);
    //     return match;
    // },
};

export default mongoose.model("StationDynamics", stationDynamicsSchema);
