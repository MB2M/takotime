import mongoose from "mongoose";
import { IScore, IStation } from "../../types/mt";

const scoreSchema = new mongoose.Schema<IScore>({
    weight: Number,
    state: {
        type: String,
        enum: ["Cancel", "Success", "Fail", "Try"],
        default: "Try",
    },
});


const StationSchema = new mongoose.Schema<IStation>({
    heatId: String,
    laneNumber: Number,
    scores: [scoreSchema],
});

export default mongoose.model<IStation>("StationMax", StationSchema);
