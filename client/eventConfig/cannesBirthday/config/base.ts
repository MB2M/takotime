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
        type: "forTime",
        workoutIds: ["23.3"],
        index: 0,
        main: {
            movements: [
                "Wall walk",
                "Double unders",
                "Snatches",
                "Wall walk",
                "Double unders",
                "Snatches",
                "Strict HSPU",
                "Double unders",
                "Snatches",
                "Strict HSPU",
                "Double unders",
                "Snatches",
            ],
            reps: [5, 50, 15, 5, 50, 12, 20, 50, 9, 20, 50, 6],
        },
    },
];
