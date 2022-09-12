type BaseStation = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: BaseScore[];
};

type BaseScore = {
    index: number;
    _id: string;
    repCount: number;
};

type WorkoutDescription = {
    name: string;
    type: "forTime" | "amrap";
    workoutIds: string[];
    buyIn?: WorkoutMovements;
    main: WorkoutMovements;
    buyOut?: WorkoutMovements;
};

type WorkoutMovements = {
    movements: string[];
    reps: number[];
};
