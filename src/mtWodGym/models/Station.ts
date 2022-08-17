import mongoose from "mongoose";
import { IScoreGym, IStation } from "../../types/mt";

const scoreSchema = new mongoose.Schema<IScoreGym>({
    roundNumber: {
        type: Number,
        enum:[1,2,3]
    },
    buyinRepCount: Number,
    gymRepCount: Number,
});


const StationSchema = new mongoose.Schema<IStation>({
    heatId: String,
    laneNumber: Number,
    scores: [scoreSchema],
});

export default mongoose.model<IStation>("StationGym", StationSchema);
