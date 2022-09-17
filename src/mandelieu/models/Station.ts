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
    scores: [scoreSchema],
});

export default mongoose.model<IBaseStation>("StationGym", StationSchema);
