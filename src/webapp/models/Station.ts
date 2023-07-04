import mongoose, { Types } from "mongoose";
import {
    IBaseStation2,
    IEndTimer,
    IWodClassicScore,
    IWodSplitScore,
    IWodWeightScore,
} from "../../types/deviceScoring";

type StationDocumentProps = {
    state: {
        wodWeight: Types.DocumentArray<IWodWeightScore>;
        wodClassic: Types.DocumentArray<IWodClassicScore>;
        endTimer: Types.DocumentArray<IEndTimer>;
    };
};

export type StationModelType = mongoose.Model<
    IBaseStation2,
    {},
    StationDocumentProps
>;

const wodWeightScoreSchema = new mongoose.Schema<IWodWeightScore>({
    weight: Number,
    partnerId: Number,
    state: {
        type: String,
        enum: ["Cancel", "Success", "Fail", "Try"],
        default: "Try",
    },
});

const wodClassicScoreSchema = new mongoose.Schema<IWodClassicScore>({
    index: {
        type: String,
        required: true,
    },
    rep: { type: Number, required: true },
});

const wodSplitScoreSchema = new mongoose.Schema<IWodSplitScore>({
    index: {
        type: String,
        required: true,
    },
    rep: { type: Number, required: true },
    repIndex: { type: Number, required: true },
    round: Number,
});

const endTimerScoreSchema = new mongoose.Schema<IEndTimer>({
    index: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
});

// const scoreSchema = new mongoose.Schema<IScore>({
//     wodWeight: [wodWeightScoreSchema],
//     wodClassic: [wodClassicScoreSchema],
// });

const StationSchema = new mongoose.Schema<IBaseStation2, StationModelType>({
    heatId: String,
    laneNumber: Number,
    scores: {
        wodWeight: { type: [wodWeightScoreSchema], default: [] },
        wodClassic: { type: [wodClassicScoreSchema], default: [] },
        endTimer: { type: [endTimerScoreSchema], default: [] },
        wodSplit: { type: [wodSplitScoreSchema], default: [] },
    },
    participantId: String,
});

export default mongoose.model<IBaseStation2, StationModelType>(
    "WebAppStation",
    StationSchema
);
