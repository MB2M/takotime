export const getScoringType = (wodType: WorkoutType) => {
    switch (wodType) {
        case "amrap":
            return "wodClassic";
        case "forTime":
            return "wodClassic";
        case "maxWeight":
            return "wodMaxWeight";
    }
};
