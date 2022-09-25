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
    workout: DocumentArray<IWorkout>;
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
    options: Document<workoutOptionSchema>;
}

interface IWorkoutOption extends Subdocument {
    wodtype: string;
    title: string;
    logo: boolean;
    logoPosition:
        | "topLeft"
        | "topRight"
        | "background"
        | "bottomLeft"
        | "bottomRight";
    chrono: boolean;
    viewMovement: "none" | "flash" | "split";
    movementFlashDureation: number;
    showRounds: boolean;
}
