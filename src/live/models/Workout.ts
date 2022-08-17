import mongoose from "mongoose";

const measurement = new mongoose.Schema({
    id: { type: Number, required: true },
    method: { type: String, default: "forTime" },
    blocksId: [Number],
    from: { type: Number, default: 0 },
    at: { type: Number, min: 1 },
    repsFrom: Number,
    repsTot: Number,
    device: {
        type: String,
        enum: ["buzzer", "timer"],
    },
    tieBreakSource: {
        type: String,
        enum: ["buzzer", "timer"],
    },
    tieBreakMethod: { type: String, default: "forTime" },
    tieBreakCut: Boolean,
    convertInTime: { type: Boolean, default: false },
    repsConvertion: { type: Number, default: 1000 },
    forSave: { type: Boolean, default: true },
    _id: { auto: false },
});

const workoutSchema = new mongoose.Schema({
    name: String,
    customId: { type: String, unique: true, required: true },
    active: { type: Boolean, default: true },
    categories: [String],
    shortcut: {
        method: {
            type: String,
            default: "forTime",
            enum: ["forTime", "amrap"],
        },
        count: { type: String, default: "normal", enum: ["normal", "sum"] },
        device: {
            type: String,
            enum: ["buzzer", "timer"],
        },
        sources: [Number],
        _id: { auto: false },
    },
    scoring: [
        {
            method: {
                type: String,
                default: "forTime",
                enum: ["forTime", "amrap"],
            },
            count: { type: String, default: "normal", enum: ["normal", "sum"] },
            sources: [Number],
            _id: { auto: false },
        },
    ],
    blocks: [
        {
            rounds: Number,
            movements: [
                {
                    name: { type: String, required: true },
                    reps: { type: Number, required: true },
                    varEachRounds: { type: Number, default: 0 },
                    _id: { auto: false },
                },
            ],
            measurements: measurement,
            _id: { auto: false },
        },
    ],
});

workoutSchema.methods = {
    // authenticate: async function (password: string) {
    //     const match = await bcrypt.compare(password, this.password);
    //     return match;
    // },
};

export default mongoose.model("Workout", workoutSchema);
