import { Model, Subdocument, Types } from "mongoose";

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
    workouts: IWorkout[];
    customFont?: string;
}

interface ICompetitionMethods {
    select(): any;
    workouts: Types.Subdocument<Types.ObjectId> & IWorkout;
}

type CompetitionModel = Model<ICompetition, {}, ICompetitionMethods>;

interface IAdmin {
    key: string;
    value: string;
}

interface baseWorkoutMovement {
    reps: string[];
    movements: string[];
}

interface IWorkout extends Subdocument {
    workoutId: string;
    linkedWorkoutId: string;
    categories: string[];
    layout: string;
    duration: number;
    dataSource?: "web" | "iot";
    wodIndexSwitchMinute: string;
    options: IWorkoutOption;

    flow: {
        buyIn: baseWorkoutMovement;
        main: baseWorkoutMovement;
        buyOut: baseWorkoutMovement;
    };
}

interface IWorkoutOption extends Subdocument {
    wodtype: "amrap" | "forTime";
    rounds: number;
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
    columnDisplayNumber: number;
}
