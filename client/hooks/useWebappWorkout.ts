import { useState, useEffect, useMemo } from "react";

const runningSum = (numbers: string[]) => {
    const cumulative: number[] = [];
    numbers.reduce((pre, curr) => {
        const sum = pre + +curr;
        cumulative.push(sum);
        return sum;
    }, 0);
    return cumulative;
};

const useWebappWorkout = (
    workout: Workout | undefined,
    repsCompleted: number
) => {
    const wodType = useMemo(() => workout?.options?.wodtype, [workout]);

    const buyInReps = useMemo(
        () => workout?.flow.buyIn?.reps?.reduce((p, c) => p + +c, 0) || 0,
        [workout]
    );
    const mainReps = useMemo(
        () => workout?.flow.main?.reps?.reduce((p, c) => p + +c, 0) || 0,
        [workout]
    );

    const buyOutReps = useMemo(
        () => workout?.flow.buyOut?.reps?.reduce((p, c) => p + +c, 0) || 0,
        [workout]
    );

    const totalRepetitions = useMemo(
        () => buyInReps + mainReps + buyOutReps,
        [workout]
    );

    const [movement, setMovement] = useState<string>("");
    const [movementReps, setMovementReps] = useState<number>(0);
    const [movementTotalReps, setMovementTotalReps] = useState<number>(0);
    const [round, setRound] = useState<number>(1);

    useEffect(() => {
        let movement;
        let movementReps;
        let movementTotalReps: number;
        let round = 1;
        switch (wodType) {
            case "forTime":
                const allReps = [
                    ...(workout?.flow.buyIn.reps || []),
                    ...(workout?.flow.main.reps || []),
                    ...(workout?.flow.buyOut?.reps || []),
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
                    ...(workout?.flow.buyIn.movements || []),
                    ...(workout?.flow.main.movements || []),
                    ...(workout?.flow.buyOut.movements || []),
                ][index];
                movementTotalReps = +(allReps[index] || 0);
                movementReps = repsCompleted - (allRepsCum[index - 1] || 0);
                break;

            case "amrap":
                const buyInRepsCum = runningSum(
                    JSON.parse(JSON.stringify(workout?.flow.buyIn?.reps || []))
                );

                const mainRepsCum = runningSum(
                    JSON.parse(JSON.stringify(workout?.flow.main.reps))
                );

                // const buyOutRepsCum = runningSum(
                //     JSON.parse(JSON.stringify(buyOutReps))
                // );

                round = Math.floor((repsCompleted - buyInReps) / mainReps) + 1;

                if (repsCompleted < buyInReps) {
                    let index = buyInRepsCum.findIndex(
                        (repsCum) => repsCompleted - repsCum < 0
                    );
                    if (index === -1) {
                        index = buyInRepsCum.length - 1;
                    }
                    movement = (workout?.flow.buyIn.movements || [])[index];
                    movementTotalReps = +(
                        (workout?.flow.buyIn.reps || [])[index] || 0
                    );
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
                    movement = (workout?.flow.main.movements || [])[index];
                    movementTotalReps = +(workout?.flow.main.reps[index] || 0);
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

export default useWebappWorkout;
