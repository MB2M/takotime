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
    heats?: Heat[];
};

type Heat = {
    customId: string;
    _id?: string;
    name: string;
    // order: number;
    results?: Result[];
};

type Result = {
    station: number;
    participant: Participant;
    result?: number;
    state?: string;
};

type Participant = {
    customId: string;
    name: string;
};
