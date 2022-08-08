import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    customId: String,
    name: String,
});

const heatSchema = new mongoose.Schema({
    customId: String,
    name: String,
    order: Number,
    date: Date,
    results: [
        {
            athleteSources: [String],
            station: Number,
            participant: participantSchema,
            result: { type: String, default: undefined },
            state: String,
            points: Number,
        },
    ],
    state: {
        type: String,
        enum: ["NF", "F"],
        default: "NF",
    },
});

const roundSchema = new mongoose.Schema({
    customId: String,
    name: String,
    finished: Boolean,
    topQualifPerHeatNumber: Number,
    draftQualifiedOverallNumber: Number,
    eliminatedNumber: Number,
    stationNumber: Number,
    points:[Number],
    ranking: {
        start: Number,
        end: Number,
    },
    resultType: {
        type: String,
        enum: ["time", "reps"],
        default: "time",
    },
    sortOrder: {
        type: String,
        enum: ["asc", "desc"],
        default: "asc",
    },
    heats: [heatSchema],
});

const tournamentSchema = new mongoose.Schema({
    name: String,
    rounds: [roundSchema],
});

//AJOUTER FONCTION DE CLASSEMENT DU ROUND

export default mongoose.model("Tournament", tournamentSchema);
