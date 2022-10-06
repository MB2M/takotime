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
        workoutIds: ["46188"],
        index: 0,
        main: {
            movements: ["x100m Row", "Hang C&J", "Box Jump Over"],
            reps: [6, 32, 16, 6, 32, 16],
        },
    },
    {
        name: "wod1b",
        type: "amrap",
        workoutIds: ["46188"],
        index: 1,
        main: {
            movements: [
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
                "Shuttle run",
                "Pull ups",
                "Shuttle run",
                "T2B",
            ],
            reps: [
                2, 10, 2, 10, 4, 12, 4, 12, 6, 14, 6, 14, 8, 16, 8, 16, 10, 18,
                10, 18, 12, 20, 12, 20, 14, 22, 14, 22,
            ],
        },
    },
    // {
    //     name: "wod1",
    //     type: "forTime",
    //     workoutIds: ["41714"],
    //     index: 1,
    //     main: {
    //         movements: ["Cal Row"],
    //         reps: [150],
    //     },
    // },
    // {
    //     name: "wod2",
    //     type: "forTime",
    //     workoutIds: ["41878"],
    //     index: 0,
    //     main: {
    //         movements: [
    //             "Pull Up + HSPU",
    //             "DB Snatch",
    //             "Burpees",
    //             "Shuttle Run",
    //         ],
    //         reps: [150, 100, 50, 25],
    //     },
    // },
    // {
    //     name: "wod3",
    //     type: "amrap",
    //     workoutIds: ["41879"],
    //     index: 0,
    //     buyIn: {
    //         movements: ["DB 1-Arm OH lunges"],
    //         reps: [60],
    //     },
    //     main: {
    //         movements: ["Cal Bike", "Deadlift", "T2B"],
    //         reps: [20, 15, 10],
    //     },
    // },
    // {
    //     name: "wod4",
    //     type: "amrap",
    //     workoutIds: ["41880"],
    //     index: 0,
    //     main: {
    //         movements: ["Rope Climb", "Clean & Jerk", "Box jump Over", "x5 DU"],
    //         reps: [1, 3, 5, 6],
    //     },
    // },
    // {
    //     name: "wod4",
    //     type: "maxWeight",
    //     workoutIds: ["41880"],
    //     index: 1,
    //     main: {
    //         movements: ["1 Power Clean + 1 Front Squat + 1 Hang Squat Clean "],
    //         reps: [1],
    //     },
    // },
    // {
    //     name: "wod5",
    //     type: "forTime",
    //     workoutIds: ["41884"],
    //     index: 0,
    //     main: {
    //         movements: [
    //             "x5 DU Heavy Rope",
    //             "Power Snatch",
    //             "C2B",
    //             "x5 DU Heavy Rope",
    //             "Squat Snatch",
    //             "Ring MU",
    //             "x5 DU Heavy Rope",
    //             "OHS",
    //             "Handstand Walk",
    //         ],
    //         reps: [12, 30, 30, 9, 15, 15, 6, 30, 30],
    //     },
    // },
];
