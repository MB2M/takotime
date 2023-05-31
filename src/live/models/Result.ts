import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    eventId: String,
    heatId: String,
    laneNumber: {
        type: Number,
        unique: false,
        required: true,
        min: 1,
    },
    participant: String,
    category: String,
    externalId: Number,
    result: String,
});

export default mongoose.model("Result", resultSchema);
