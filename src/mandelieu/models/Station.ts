import mongoose from "mongoose";
import { IBaseScore, IBaseStation } from "../../types/deviceScoring";

const scoreSchema = new mongoose.Schema<IBaseScore>({
    index: {
        type: Number,
    },
    repCount: Number,
});

const StationSchema = new mongoose.Schema<IBaseStation>({
    heatId: String,
    laneNumber: Number,
    participant: String,
    scores: [scoreSchema],
    times: [{ rep: Number, time: Number, index: Number }],
});

export default mongoose.model<IBaseStation>("StationGym", StationSchema);
