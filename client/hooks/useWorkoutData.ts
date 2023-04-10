import useWebWorkout from "./useWorkout";
import React from "react";

interface WorkoutData {
    currentMovement: string;
    currentMovementReps: number;
    currentMovementTotalReps: number;
    currentRound: number;
}

const defaultState: WorkoutData = {
    currentMovement: "",
    currentMovementReps: 0,
    currentMovementTotalReps: 0,
    currentRound: 0,
};

const useWorkoutData = (
    station: WidescreenStation,
    repsCompleted: number,
    dataSource: DataSource,
    workout?: WorkoutDescription
) => {
    const [state, setState] = React.useState<WorkoutData>(defaultState);

    const { movement, movementReps, movementTotalReps, round } = useWebWorkout(
        workout,
        repsCompleted
    );

    React.useEffect(() => {
        switch (dataSource) {
            case "iot":
                setState({
                    currentMovement: station.currentMovement,
                    currentMovementReps: station.repsOfMovement,
                    currentMovementTotalReps: station.totalRepsOfMovement,
                    currentRound: station.position.round + 1,
                });
                break;
            case "web":
                setState({
                    currentMovement: movement,
                    currentMovementReps: movementReps,
                    currentMovementTotalReps: movementTotalReps,
                    currentRound: round,
                });
                break;
        }
    }, [dataSource, station, movement, movementReps, movementTotalReps, round]);

    switch (dataSource) {
        case "iot":
            return {
                currentMovement: station.currentMovement,
                currentMovementReps: station.repsOfMovement,
                currentMovementTotalReps: station.totalRepsOfMovement,
                currentRound: station.position.round + 1,
            };
        case "web":
            return {
                currentMovement: movement,
                currentMovementReps: movementReps,
                currentMovementTotalReps: movementTotalReps,
                currentRound: round,
            };
    }

    return state;
};

export default useWorkoutData;
