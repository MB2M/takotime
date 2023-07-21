import { Document, DocumentArray, Subdocument } from "mongoose";

interface IBaseStation extends Document {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: DocumentArray<IBaseScore>;
    participant?: string;

    times?: { rep: number; time: number; index: number }[];
}

interface IBaseScore extends Subdocument {
    _id: string;
    index: number;
    repCount: number;
}

interface IScore extends Subdocument {
    _id: string;
    wodWeight: DocumentArray<IWodWeightScore>;
    wodClassic: DocumentArray<IWodClassicScore>;
}

interface IWodWeightScore extends Subdocument {
    _id: string;
    weight?: number;
    state?: string;
    partnerId?: number;
}

interface IWodClassicScore extends Subdocument {
    _id: string;
    rep: number;
    index: string;
}

interface IWodSplitScore extends Subdocument {
    _id: string;
    rep: number;
    index: string;
    repIndex: number;
    round?: number;
}

type IScoreType = "wodWeight" | "wodClassic";

//new
interface IBaseStation2 extends Document {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores: {
        wodWeight: IWodWeightScore[];
        wodClassic: IWodClassicScore[];
        endTimer: IEndTimer[];
        wodSplit: IWodSplitScore[];
    };
    participantId?: string;
    category?: string;

    times?: { rep: number; time: number; index: number }[];
}

interface IEndTimer extends Document {
    _id: string;
    time: string;
    index: string;
}
