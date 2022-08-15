import mongoose from "mongoose";
import { IHeatConfig } from "../../types/mt";

const HeatConfigSchema = new mongoose.Schema<IHeatConfig>({
    heatId: String,
    rounds: [
        {
            roundNumber: {
                type: Number,
                enum: [1, 2, 3],
            },
            pointsPerMovement: {
                type: Number,
                default: 1,
            },
            buyInReps: {
                type: Number,
                default: 24,
            },
        },
    ],
});

export default mongoose.model<IHeatConfig>("HeatConfig", HeatConfigSchema);
