import bg from "../../../public/img/mandelieuBackground.jpg";
import logo from "../../../public/img/logoMandelieu.png";
import logoBlanc from "../../../public/img/logoMandelieuBlanc.png";

export const baseConfig = {
    wodNumber: 5,
};

export { logo, logoBlanc, bg };

export const workouts: WorkoutDescription[] = [
    {
        name: "wod1",
        type: "maxWeight",
        workoutIds: ["wod2Team"],
        index: 0,
        main: {
            movements: ["Clean & Jerk"],
            reps: [1],
        },
    },
    {
        name: "wod1",
        type: "amrap",
        workoutIds: ["wod2Team"],
        index: 1,
        main: {
            movements: ["GTO", "T2B", "PTL"],
            reps: [12, 10, 14],
        },
    },
    {
        name: "wod1",
        type: "amrap",
        workoutIds: ["wod2Team"],
        index: 2,
        main: {
            movements: ["Cal row"],
            reps: [1000],
        },
    },
];
