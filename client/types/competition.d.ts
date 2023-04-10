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

type Workout = {
    workoutId?: string;
    layout?: string;
    duration?: number;
    dataSource: DataSource;
    wodIndexSwitchMinute?: number;
    options?: WorkoutOption;
};

type WorkoutOption = {
    wodtype?: "amrap" | "forTime";
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
    rankBy?: "repsCount" | "lineNumber";
    viewMovement?: "none" | "flash" | "split";
    movementFlashDuration?: number;
    showRounds?: boolean;
};

type Platform = "CompetitionCorner" | "None";

type NameIdObject = {
    name: string;
    id: number;
};
