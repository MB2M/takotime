import mongoose from "mongoose";


const workoutOptionSchema = new mongoose.Schema<IWorkoutOption>({
    wodtype: {
        type: String,
        enum: ["amrap", "forTime"],
        default: "forTime",
    },
    title: {
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
    viewMovement: {
        type: String,
        default: "flash",
        enum: ["none", "flash", "split"],
    },
    movementFlashDureation: Number,
    showRounds: {
        type: Boolean,
        default: true,
    },
});

const workoutSchema = new mongoose.Schema<IWorkout>({
    workoutId: String,
    layout: {
        type: String,
        default: "default",
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
        enum: ["CompetitionCorner"],
        default: "CompetitionCorner",
    },
    eventId: { type: String, required: true, unique: true, minLength: 4 },
    selected: { type: Boolean, required: true, default: false },
    logoUrl: String,
    logoDarkUrl: String,
    // workouts
    workout: [workoutSchema],
    //font
    //colors
    primaryColor: String,
    secondaryColor: String,
    //medias
});

competitionSchema.methods = {
    select: async function () {
        const competitions = await mongoose
            .model("Competition")
            .find({ selected: true })
            .exec();
        competitions.forEach((competition) => {
            competition.updateOne({ selected: false }).exec();
        });
        const competition = this.updateOne({ selected: true }).exec();
        return competition;
    },
};

export default mongoose.model<ICompetition, CompetitionModel>(
    "Competition",
    competitionSchema
);
