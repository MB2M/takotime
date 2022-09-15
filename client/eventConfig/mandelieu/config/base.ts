import bg from "../../../public/img/mandelieuBackground.jpg";
import logo from "../../../public/img/logoMandelieu.png";
import logoBlanc from "../../../public/img/logoMandelieuBlanc.png";

export const baseConfig = {
    wodNumber: 5,
};


export {logo, logoBlanc, bg}


export const workouts: WorkoutDescription[] = [
    {
        name: "wod1",
        type: "forTime",
        workoutIds: ["42555"],
        index: 0,
        main: {
            movements: ["Wall Ball"],
            reps: [150],
        },
    },
    {
        name: "wod1",
        type: "forTime",
        workoutIds: ["42555"],
        index: 1,
        main: {
            movements: ["Cal Row"],
            reps: [150],
        },
    },
    {
        name: "wod2",
        type: "forTime",
        workoutIds: ["43604"],
        index: 0,
        main: {
            movements: [
                "Pull Up + HSPU",
                "DB Snatch",
                "Burpees",
                "Shuttle Run",
            ],
            reps: [150, 100, 50, 25],
        },
    },
    {
        name: "wod3",
        type: "amrap",
        workoutIds: ["43606"],
        index: 0,
        buyIn: {
            movements: ["DB 1-Arm OH lunges"],
            reps: [60],
        },
        main: {
            movements: ["Cal Bike", "Deadlift", "T2B"],
            reps: [20, 15, 10],
        },
    },
    {
        name: "wod4",
        type: "amrap",
        workoutIds: ["43607"],
        index: 0,
        main: {
            movements: ["Rope Climb", "Clean & Jerk", "Box jump Over", "DU"],
            reps: [1, 3, 5, 30],
        },
    },
    {
        name: "wod4",
        type: "maxWeight",
        workoutIds: ["43607"],
        index: 1,
        main: {
            movements: ["1 Power Clean + 1 Front Squat + 1 Hang Squat Clean "],
            reps: [1],
        },
    },
    {
        name: "wod5",
        type: "forTime",
        workoutIds: ["43769"],
        index: 0,
        main: {
            movements: [
                "DU Heavy Rope",
                "Power Snatch",
                "C2B",
                "DU Heavy Rope",
                "Squat Snatch",
                "Ring MU",
                "DU Heavy Rope",
                "OHS",
                "Handstand Walk",
            ],
            reps: [60, 30, 30, 45, 15, 15, 60, 30, 30],
        },
    },
];
