type Tournament = {
    _id: string;
    name: string;
    rounds: Round[];
};

type Round = {
    customId: string;
    _id?: string;
    name: string;
    topQualifPerHeatNumber: number;
    draftQualifiedOverallNumber: number;
    eliminatedNumber: number;
    stationNumber: number;
    ranking: {
        start: number;
        end: number;
    };
    resultType: "time" | "reps";
    sortOrder: "asc" | "desc";
    heats: Heat[];
    points?: number[];
};

type Heat = {
    customId: string;
    _id?: string;
    name: string;
    state: "NF" | "F";
    results: Result[];
};

type Result = {
    _id?: any;
    station: number;
    participant: Participant;
    result: string;
    state: State;
    athleteSources?: [];
    points?: number;
};

type Participant = {
    customId: string;
    name: string;
};

type State = "R" | "Q" | "E" | "W" | "D";
