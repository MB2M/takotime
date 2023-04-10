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
        type: "amrap",
        workoutIds: ["wod1"],
        index: 0,
        main: {
            movements: ["Thrusters", "Box Jump over"],
            reps: [10, 10],
        },
    },
    {
        name: "wod2",
        type: "forTime",
        workoutIds: ["wod2"],
        index: 0,
        main: {
            movements: [
                "Wall walks",
                "DB Snatches",
                "C2B",
                "Wall walks",
                "DB Snatches",
                "C2B",
                "Wall walks",
                "DB Snatches",
                "C2B",
                "Wall walks",
                "DB Snatches",
                "C2B",
            ],
            reps: [12, 30, 15, 9, 30, 15, 6, 30, 15, 3, 30, 15],
        },
    },
    {
        name: "wod3",
        type: "maxWeight",
        workoutIds: ["wod3"],
        index: 0,
        main: {
            movements: ["1 Clean "],
            reps: [1],
        },
    },
    {
        name: "wod3",
        type: "forTime",
        workoutIds: ["wod3"],
        index: 1,
        main: {
            movements: ["Burpees over the bar"],
            reps: [150],
        },
    },
    {
        name: "wod3",
        type: "maxWeight",
        workoutIds: ["wod3"],
        index: 2,
        main: {
            movements: ["1 Clean + 1 STOH + 1 Front Squat + 1 STOH"],
            reps: [1],
        },
    },
    {
        name: "wod4",
        type: "amrap",
        workoutIds: ["wod4"],
        index: 0,
        main: {
            movements: ["Deadlifts", "Ring MU", "DU"],
            reps: [5, 10, 50],
        },
    },
];
