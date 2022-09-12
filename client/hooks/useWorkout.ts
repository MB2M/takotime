import { useState, useEffect, useMemo } from "react";

const runningSum = (numbers: number[]) => {
    numbers.reduce((pre, curr, i) => {
        numbers[i] = pre + curr;
        return numbers[i];
    }, 0);
    return numbers;
};

const useWorkout = (
    workouts: WorkoutDescription[],
    workoutId: string,
    repsCompleted: number
) => {
    const workout = useMemo(
        () =>
            workouts.find((workout) => workout.workoutIds.includes(workoutId)),
        [workouts, workoutId]
    );

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

    useEffect(() => {
        let currentMovement;
        let currentMovementReps;
        let currentMovementTotalReps;
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

            default:
                currentMovement = "";
                currentMovementTotalReps = 0;
                currentMovementReps = 0;
                break;
        }
        setCurrentMovement(currentMovement);
        setCurrentMovementReps(currentMovementReps);
        setCurrentMovementTotalReps(currentMovementTotalReps);
    }, [repsCompleted, workout, totalReps]);

    return {
        totalReps,
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
    };
};

export default useWorkout;
