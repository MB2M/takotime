import { useMemo } from "react";
import useWebappWorkout from "../../hooks/useWebappWorkout";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { splitMTscore } from "../../utils/splitMTscore";

interface Props {
    workout: Workout;
    scores: BaseStation2["scores"];
}
const RemoteWorkoutFinalScore = ({ workout, scores }: Props) => {
    const selectedWorkoutId = workout.workoutId;
    const layout = workout.layout;

    const repsCompleted = useMemo(() => {
        switch (true) {
            case layout?.includes("splitMT"):
                return splitMTscore(scores.wodSplit, workout);

            case layout?.includes("split"):
                return (
                    scores["wodSplit"]
                        ?.filter((score) => score.index === selectedWorkoutId)
                        .reduce((total, rep) => total + rep.rep, 0) || 0
                );

            default:
                return (
                    scores["wodClassic"]
                        ?.filter((score) => score.index === selectedWorkoutId)
                        .reduce((total, rep) => total + rep.rep, 0) || 0
                );
        }
    }, [scores, selectedWorkoutId, workout]);

    const endTimeScore = useMemo(() => {
        return scores.endTimer.findLast(
            (score) => score.index === selectedWorkoutId
        );
    }, [scores, selectedWorkoutId]);

    const {
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        round: currentRound,
    } = useWebappWorkout(workout, repsCompleted);

    const getReturn = () => {
        switch (true) {
            case layout?.includes("split"):
                return `${repsCompleted} reps`;
            default:
                return `${repsCompleted} reps (${
                    workout.options?.wodtype === "amrap"
                        ? `round ${currentRound}:`
                        : ""
                } ${currentMovementReps} / ${currentMovementTotalReps} ${currentMovement})`;
        }
    };

    return (
        <Box>
            {workout.options?.wodtype &&
                ["amrap", "forTime"].includes(workout.options.wodtype) &&
                (!!endTimeScore ? (
                    <Typography>{endTimeScore.time}</Typography>
                ) : (
                    <Typography>{getReturn()}</Typography>
                ))}
        </Box>
    );
};

export default RemoteWorkoutFinalScore;
