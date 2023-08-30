type BaseStation = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: BaseScore[];
    participant?: string;

    times?: { rep: number; time: number; index: number }[];
};

type BaseScore = {
    index: string;
    _id: string;
    repCount: number;
};

type WorkoutDescription = {
    name: string;
    index: number;
    type: "forTime" | "amrap" | "maxWeight";
    workoutIds: string[];
    buyIn?: WorkoutMovements;
    main: WorkoutMovements;
    buyOut?: WorkoutMovements;
};

type WorkoutMovements = {
    movements: string[];
    reps: number[];
};

type LiftState = "Cancel" | "Success" | "Fail" | "Try";

type BaseStation2 = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores: {
        wodWeight: {
            _id: string;
            partnerId: number;
            weight: number;
            state: LiftState;
            index: string;
        }[];
        wodClassic: { _id: string; rep: number; index: string }[];
        endTimer: { _id: string; time: string; index: string }[];
        wodSplit: {
            _id: string;
            rep: number;
            index: string;
            repIndex: number;
            round: number;
        }[];
    };
    times?: { rep: number; time: number; index: number }[];
};

type DisplayFullStation = Pick<
    Station,
    "laneNumber" | "participant" | "category" | "externalId"
> & {
    scores?: BaseStation2["scores"];
};

type WodResult = {
    workoutId: string;
    results: {
        rank: number;
        finalScore: string | number;
        finished: boolean;
        participantId: number;
    }[];
};
