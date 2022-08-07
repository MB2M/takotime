import {
    Model,
    Schema,
    model,
    HydratedDocument,
    Document,
    Subdocument,
    Embedded,
    Types,
    DocumentArray,
} from "mongoose";

interface IStation extends Document {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: DocumentArray<IScore>;
}

interface IScore extends Subdocument {
    _id: string;
    weight?: number;
    state?: string;
}

interface IChoice {
    _id: string;
    name: string;
    count: number;
    addCount: ({ name: string }) => void;
}

interface ChoiceModel extends Model<IChoice> {
    deleteAll(): Promise<HydratedDocument<IChoice>>;
    resetAll(): Promise<HydratedDocument<IChoice>>;
    addChoice(name: string): Promise<HydratedDocument<IChoice>>;
}
