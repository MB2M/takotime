interface ICompetition {
    _id: string;
    name: string;
    state: "active" | "inactive";
    platform: "CompetitionCorner";
    eventId: string;
    selected: boolean;
    logoUrl?: string;
    logoDarkUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    workouts: DocumentArray<IWorkout>;
}

interface ICompetitionMethods {
    select(): Promise<ICompetition>;
}

type CompetitionModel = Model<ICompetition, {}, ICompetitionMethods>;

interface IAdmin {
    key: string;
    value: string;
}

interface IWorkout extends Subdocument {
    workoutId: string;
    layout: string;
    duration: number;
    options: Document<workoutOptionSchema>;
}

interface IWorkoutOption extends Subdocument {
    wodtype: "amrap" | "forTime";
    title: boolean;
    titlePosition: "top" | "bottom";
    titleType: "category" | "heat" | "heat-category" | "category-heat";
    logo: boolean;
    logoPosition:
        | "topLeft"
        | "topRight"
        | "background"
        | "bottomLeft"
        | "bottomRight";
    chrono: boolean;
    chronoPosition:
        | "topLeft"
        | "topRight"
        | "background"
        | "bottomLeft"
        | "bottomRight";
    chronoDirection: string;
    rankBy: "repsCount" | "lineNumber";
    viewMovement: "none" | "flash" | "split";
    movementFlashDuration: number;
    showRounds: boolean;
}
