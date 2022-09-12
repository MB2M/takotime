import { Document, DocumentArray, Subdocument } from "mongoose";

interface IBaseStation extends Document {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: DocumentArray<IBaseScore>;
}

interface IBaseScore extends Subdocument {
    _id: string;
    index: number;
    repCount: number;
}
