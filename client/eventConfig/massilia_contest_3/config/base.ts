import bg from "../../../public/img/mandelieuBackground.jpg";
import logo from "../../../public/img/logoMandelieu.png";
import logoBlanc from "../../../public/img/logoMandelieuBlanc.png";

export const baseConfig = {
    wodNumber: 5,
};

export { logo, logoBlanc, bg };

export const workouts: WorkoutDescription[] = [
    {
        name: "wod1a",
        type: "forTime",
        workoutIds: ["aaaa"],
        index: 0,
        main: {
            movements: ["x100m Row", "Hang C&J", "Box Jump Over"],
            reps: [6, 32, 16, 6, 32, 16],
        },  
    },
    {
        name: "wod1b",
        type: "amrap",
        workoutIds: ["aaaa"],
        index: 1,
        main: {
            movements: [
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
            ],
            reps: [
                2, 10, 2, 10,
            ],
        },
    },
    {
        name: "wod3",
        type: "forTime",
        workoutIds: ["46192"],
        index: 0,
        main: {
            movements: ["Heavy DU", "Wall Ball", "Deadlift"],
            reps: [60, 30, 30, 60, 30, 30, 60, 30, 30, 60, 30, 30],
        },
    },
    {
        name: "wod4",
        type: "forTime",
        workoutIds: ["46195"],
        index: 0,
        main: {
            movements: ["Heavy DU", "Wall Ball", "Deadlift"],
            reps: [60, 30, 30, 60, 30, 30, 60, 30, 30, 60, 30, 30],
        },
    },
    {
        name: "wod2",
        type: "maxWeight",
        workoutIds: ["46190"],
        index: 0,
        main: {
            movements: ["Thruster", "Snatch"],
            reps: [1],
        },
    },
];
