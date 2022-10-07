import { useState, useEffect, useMemo } from "react";

const runningSum = (numbers: number[]) => {
    numbers.reduce((pre, curr, i) => {
        numbers[i] = pre + curr;
        return numbers[i];
    }, 0);
    return numbers;
};

const useWorkout = (
    workout: WorkoutDescription | undefined,
    repsCompleted: number
) => {

    const wodType = useMemo(() => workout?.type, [workout]);

    const buyInReps = useMemo(
        () => workout?.buyIn?.reps?.reduce((p, c) => p + c, 0) || 0,
        [workout]
    );
    const mainReps = useMemo(
        () => workout?.main?.reps?.reduce((p, c) => p + c, 0) || 0,
        [workout]
    );

    const buyOutReps = useMemo(
        () => workout?.buyOut?.reps?.reduce((p, c) => p + c, 0) || 0,
        [workout]
    );

    const totalRepetitions = useMemo(
        () => buyInReps + mainReps + buyOutReps,
        [workout]
    );

    const [movement, setMovement] = useState<string>("");
    const [movementReps, setMovementReps] = useState<number>(0);
    const [movementTotalReps, setMovementTotalReps] =
        useState<number>(0);
    const [round, setRound] = useState<number>(1);

    useEffect(() => {
        let movement;
        let movementReps;
        let movementTotalReps;
        let round = 1;
        switch (workout?.type) {
            case "forTime":
                const allReps = [
                    ...(workout.buyIn?.reps || []),
                    ...workout.main.reps,
                    ...(workout.buyOut?.reps || []),
                ];
                const allRepsCum = runningSum(
                    JSON.parse(JSON.stringify(allReps))
                );
                let index = allRepsCum.findIndex(
                    (repsCum) => repsCompleted - repsCum < 0
                );

                if (index === -1) {
                    index = allRepsCum.length - 1;
                }

                movement = [
                    ...(workout.buyIn?.movements || []),
                    ...workout.main.movements,
                    ...(workout.buyOut?.movements || []),
                ][index];
                movementTotalReps = allReps[index];
                movementReps =
                    repsCompleted - (allRepsCum[index - 1] || 0);
                break;

            case "amrap":
                const buyInRepsCum = runningSum(
                    JSON.parse(JSON.stringify(workout.buyIn?.reps || []))
                );

                const mainRepsCum = runningSum(
                    JSON.parse(JSON.stringify(workout.main.reps))
                );

                // const buyOutRepsCum = runningSum(
                //     JSON.parse(JSON.stringify(buyOutReps))
                // );

                round =
                    Math.floor((repsCompleted - buyInReps) / mainReps) + 1;

                if (repsCompleted < buyInReps) {
                    let index = buyInRepsCum.findIndex(
                        (repsCum) => repsCompleted - repsCum < 0
                    );
                    if (index === -1) {
                        index = buyInRepsCum.length - 1;
                    }
                    movement = (workout.buyIn?.movements || [])[index];
                    movementTotalReps = (workout.buyIn?.reps || [])[
                        index
                    ];
                    movementReps =
                        repsCompleted - (buyInRepsCum[index - 1] || 0);
                } else {
                    let index = mainRepsCum.findIndex(
                        (repsCum) =>
                            ((repsCompleted - buyInReps) % mainReps) - repsCum <
                            0
                    );

                    if (index === -1) {
                        index = mainRepsCum.length - 1;
                    }
                    movement = (workout.main.movements || [])[index];
                    movementTotalReps = workout.main.reps[index];
                    movementReps =
                        ((repsCompleted - buyInReps) % mainReps) -
                        (mainRepsCum[index - 1] || 0);
                }

                break;

            default:
                movement = "";
                movementTotalReps = 0;
                movementReps = 0;
                break;
        }
        setMovement(movement);
        setMovementReps(movementReps);
        setMovementTotalReps(movementTotalReps);
        setRound(round);
    }, [repsCompleted, workout, totalRepetitions]);

    return {
        totalRepetitions,
        movement,
        movementReps,
        movementTotalReps,
        round,
        wodType,
    };
};

export default useWorkout;
