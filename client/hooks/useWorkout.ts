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

    const workoutType = useMemo(() => workout?.type, [workout]);

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

    const totalReps = useMemo(
        () => buyInReps + mainReps + buyOutReps,
        [workout]
    );

    const [currentMovement, setCurrentMovement] = useState<string>("");
    const [currentMovementReps, setCurrentMovementReps] = useState<number>(0);
    const [currentMovementTotalReps, setCurrentMovementTotalReps] =
        useState<number>(0);
    const [currentRound, setCurrentRound] = useState<number>(1);

    useEffect(() => {
        let currentMovement;
        let currentMovementReps;
        let currentMovementTotalReps;
        let currentRound = 1;
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

                currentMovement = [
                    ...(workout.buyIn?.movements || []),
                    ...workout.main.movements,
                    ...(workout.buyOut?.movements || []),
                ][index];
                currentMovementTotalReps = allReps[index];
                currentMovementReps =
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

                currentRound =
                    Math.floor((repsCompleted - buyInReps) / mainReps) + 1;

                if (repsCompleted < buyInReps) {
                    let index = buyInRepsCum.findIndex(
                        (repsCum) => repsCompleted - repsCum < 0
                    );
                    if (index === -1) {
                        index = buyInRepsCum.length - 1;
                    }
                    currentMovement = (workout.buyIn?.movements || [])[index];
                    currentMovementTotalReps = (workout.buyIn?.reps || [])[
                        index
                    ];
                    currentMovementReps =
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
                    currentMovement = (workout.main.movements || [])[index];
                    currentMovementTotalReps = workout.main.reps[index];
                    currentMovementReps =
                        ((repsCompleted - buyInReps) % mainReps) -
                        (mainRepsCum[index - 1] || 0);
                }

                break;

            default:
                currentMovement = "";
                currentMovementTotalReps = 0;
                currentMovementReps = 0;
                break;
        }
        setCurrentMovement(currentMovement);
        setCurrentMovementReps(currentMovementReps);
        setCurrentMovementTotalReps(currentMovementTotalReps);
        setCurrentRound(currentRound);
    }, [repsCompleted, workout, totalReps]);

    return {
        totalReps,
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
        currentRound,
        workoutType,
    };
};

export default useWorkout;
