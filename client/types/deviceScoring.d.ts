type BaseStation = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: BaseScore[];
    participant?: string;
};

type BaseScore = {
    index: number;
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
