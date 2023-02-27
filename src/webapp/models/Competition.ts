import mongoose from "mongoose";

const workoutOptionSchema = new mongoose.Schema<IWorkoutOption>({
    wodtype: {
        type: String,
        enum: ["amrap", "forTime"],
        default: "forTime",
    },
    title: {
        type: Boolean,
        default: true,
    },
    titlePosition: {
        type: String,
        enum: ["top", "bottom"],
        default: "top",
    },
    titleType: {
        type: String,
        enum: ["category", "heat", "heat-category", "category-heat"],
        default: "heat",
    },
    logo: {
        type: Boolean,
        default: true,
    },
    logoPosition: {
        type: String,
        enum: [
            "topLeft",
            "topRight",
            "background",
            "bottomLeft",
            "bottomRight",
        ],
        default: "topLeft",
    },
    chrono: {
        type: Boolean,
        default: true,
    },
    chronoPosition: {
        type: String,
        enum: [
            "topLeft",
            "topRight",
            "background",
            "bottomLeft",
            "bottomRight",
        ],
        default: "topRight",
    },
    chronoDirection: {
        type: String,
        enum: ["asc", "desc"],
        defaut: "asc",
    },
    rankBy: {
        type: String,
        enum: ["repsCount", "lineNumber"],
        default: "repsCount",
    },
    viewMovement: {
        type: String,
        enum: ["none", "flash", "split"],
        default: "flash",
    },
    movementFlashDuration: {
        type: Number,
        default: 5,
    },
    showRounds: {
        type: Boolean,
        default: true,
    },
});

const workoutSchema = new mongoose.Schema<IWorkout>({
    workoutId: { type: String, unique: true },
    layout: {
        type: String,
        default: "default",
    },
    duration: Number,
    dataSource: {
        type: String,
        enum: ["web", "iot"],
        default: "iot",
    },
    wodIndexSwitchMinute: {
        type: Number,
        default: 0,
    },
    options: workoutOptionSchema,
});

const competitionSchema = new mongoose.Schema<
    ICompetition,
    CompetitionModel,
    ICompetitionMethods
>({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: 4,
    },
    state: {
        type: String,
        enum: ["active", "Inactive"],
        default: "active",
    },
    platform: {
        type: String,
        enum: ["CompetitionCorner", "None"],
        default: "CompetitionCorner",
    },
    eventId: { type: String, required: true, unique: true, minLength: 4 },
    selected: { type: Boolean, required: true, default: false },
    logoUrl: String,
    logoDarkUrl: String,
    // workouts
    workouts: [workoutSchema],
    //font
    //colors
    primaryColor: String,
    secondaryColor: String,
    //medias
});

competitionSchema.methods = {
    select: async function (this: CompetitionModel) {
        const competitions = await mongoose
            .model("Competition")
            .find({ selected: true })
            .exec();
        competitions.forEach((competition) => {
            competition.updateOne({ selected: false }).exec();
        });
        const competition = this.update({ selected: true }).exec();
        return competition;
    },
};

export default mongoose.model<ICompetition, CompetitionModel>(
    "Competition",
    competitionSchema
);
