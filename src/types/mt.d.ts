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

interface ITournament extends Document {
    name: string;
    rounds: DocumentArray<IRound>;
}

interface IRound extends Subdocument {
    customId: string;
    name: string;
    finished: boolean;
    topQualifPerHeatNumber: number;
    draftQualifiedOverallNumber: number;
    eliminatedNumber: number;
    stationNumber: number;
    points: number[];
    ranking: {
        start: number;
        end: number;
    };
    resultType: "time" | "reps";
    sortOrder: "asc" | "desc";
    heats: DocumentArray<IHeat>;
}

interface IHeat extends Subdocument {
    customId: string;
    name: string;
    order: number;
    date: Date;
    results: DocumentArray<IResult>;
    state: "NF" | "F";
}

interface IResult extends Subdocument {
    athleteSources: string[];
    station: number;
    participant: DocumentArray<IParticipant>;
    result: string;
    state: string;
    points: number;
}

interface IParticipant extends Subdocument {
    customId: string;
    name: string;
}

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
