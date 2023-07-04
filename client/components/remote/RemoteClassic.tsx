import { Box, Button, Stack, Typography } from "@mui/material";
import useWebappWorkout from "../../hooks/useWebappWorkout";
import { useMemo } from "react";

interface Props {
    workout: Workout;
    sendMessage: (message: string) => void;
    laneNumber: number;
    station?: BaseStation2 | null;
    participantId: string;
}

const RemoteClassic = ({
    workout,
    sendMessage,
    laneNumber,
    station,
    participantId,
}: Props) => {
    const selectedWorkoutId = workout.workoutId;
    const handleRepsClick = (value: number) => () => {
        sendMessage(
            JSON.stringify({
                topic: "newRep",
                data: {
                    station: laneNumber,
                    value: value,
                    wodIndex: selectedWorkoutId,
                    participantId,
                },
            })
        );
    };

    const endTimeScore = useMemo(() => {
        return station?.scores.endTimer.findLast(
            (score) => score.index === selectedWorkoutId
        );
    }, [station?.scores, selectedWorkoutId]);

    const repsCompleted = useMemo(() => {
        return (
            station?.scores?.["wodClassic"]
                ?.filter((score) => score.index === selectedWorkoutId)
                .reduce((total, rep) => total + rep.rep, 0) || 0
        );
    }, [station?.scores, selectedWorkoutId]);

    const {
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        round: currentRound,
        wodType: workoutType,
    } = useWebappWorkout(workout, repsCompleted);

    return (
        <>
            <Box my={"auto"}>
                {workoutType === "amrap" && currentRound > 0 && (
                    <Typography textAlign="center" fontFamily={"CantoraOne"}>
                        Round n° {currentRound}
                    </Typography>
                )}
                <Typography
                    textAlign={"center"}
                    fontSize={"2.5rem"}
                    fontFamily={"CantoraOne"}
                >
                    {endTimeScore?.time}
                </Typography>
                <Typography
                    textAlign="center"
                    fontSize={"4.5rem"}
                    fontFamily={"CantoraOne"}
                >
                    {currentMovementReps}
                </Typography>
                <Typography variant="h5" textAlign="center">
                    {`/ ${currentMovementTotalReps} ${currentMovement}`}
                </Typography>
            </Box>
            <Box display="flex" justifyContent={"center"} mt={"auto"}>
                <Stack gap={5} alignItems={"center"}>
                    <Button
                        variant={"contained"}
                        color="success"
                        sx={{
                            height: "60vw",
                            width: "60vw",
                            fontSize: "80px",
                            borderRadius: "50%",
                        }}
                        onClick={handleRepsClick(1)}
                    >
                        +
                    </Button>
                    <Button
                        variant={"contained"}
                        color="error"
                        sx={{ width: "70vw", fontSize: "20px" }}
                        onClick={handleRepsClick(-1)}
                    >
                        -
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

export default RemoteClassic;
