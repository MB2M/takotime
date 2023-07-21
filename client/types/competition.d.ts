type Competition = {
    _id: string;
    name: string;
    state: "active" | "inactive";
    platform: "CompetitionCorner" | "None";
    eventId: string;
    selected: boolean;
    logoUrl?: string;
    logoDarkUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    workouts: Workout[];
};

type DataSource = "web" | "iot";

interface baseWorkoutMovement {
    reps: string[];
    movements: string[];
}

type Workout = {
    workoutId?: string;
    linkedWorkoutId?: string;
    categories?: string[];
    layout?: string;
    duration?: number;
    dataSource: DataSource;
    wodIndexSwitchMinute: number;
    options?: WorkoutOption;
    flow: {
        buyIn: baseWorkoutMovement;
        main: baseWorkoutMovement;
        buyOut: baseWorkoutMovement;
    };
};

type WorkoutType = "amrap" | "forTime" | "maxWeight";

type WorkoutOption = {
    wodtype?: "amrap" | "forTime";
    rounds?: number;
    title?: boolean;

    titlePosition?: "top" | "bottom";
    titleType?: "category" | "heat" | "heat-category" | "category-heat";
    logo?: boolean;
    logoPosition?:
        | "topLeft"
        | "topRight"
        | "background"
        | "bottomLeft"
        | "bottomRight";
    chrono?: boolean;
    chronoPosition?:
        | "topLeft"
        | "topRight"
        | "background"
        | "bottomLeft"
        | "bottomRight";
    chronoDirection?: "asc" | "desc";
    rankBy?: "repsCount" | "laneNumber";
    viewMovement?: "none" | "flash" | "split";
    movementFlashDuration?: number;
    showRounds?: boolean;
    columnDisplayNumber?: number;
};

type Platform = "CompetitionCorner" | "None";

type NameIdObject = {
    name: string;
    id: number;
};
