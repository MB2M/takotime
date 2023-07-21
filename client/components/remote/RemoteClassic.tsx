import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import useWebappWorkout from "../../hooks/useWebappWorkout";
import { useEffect, useMemo, useState } from "react";

interface Props {
    workout: Workout;
    sendMessage: (message: string) => void;
    laneNumber: number;
    station?: BaseStation2 | null;
    participantId: string;
    category: string;
}

const RemoteClassic = ({
    workout,
    sendMessage,
    laneNumber,
    station,
    participantId,
    category,
}: Props) => {
    const selectedWorkoutId = workout.workoutId;
    const [multiplier, setMultiplier] = useState(1);

    const handleRepsClick = (value: number) => () => {
        sendMessage(
            JSON.stringify({
                topic: "newRep",
                data: {
                    station: laneNumber,
                    value: value,
                    wodIndex: selectedWorkoutId,
                    participantId,
                    category,
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

    // const showMultiplier = [
    //     "DU",
    //     "DOUBLE UNDERS",
    //     "ROW",
    //     "ROWS",
    //     "CAL",
    //     "ERG",
    //     "ASSAULT",
    // ].some((text) => currentMovement.toUpperCase().includes(text));

    const showMultiplier = currentMovementTotalReps > 50;

    const handleMutliplierClick = (value: number) => () => {
        setMultiplier(value);
    };

    const upMultiplier = Math.max(
        Math.min(multiplier, currentMovementTotalReps - currentMovementReps),
        1
    );

    const downMultiplier = Math.max(
        Math.min(multiplier, currentMovementReps),
        1
    );

    useEffect(() => {
        if (!showMultiplier) setMultiplier(1);
    }, [showMultiplier]);

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
            {/*<Box display="flex" justifyContent={"center"} mt={"auto"}>*/}
            <Stack gap={5} alignItems={"center"} pb={5}>
                <Button
                    variant={"contained"}
                    color="primary"
                    sx={{
                        height: "60vw",
                        width: "60vw",
                        fontSize: "70px",
                        borderRadius: "50%",
                    }}
                    onClick={handleRepsClick(upMultiplier)}
                >
                    + {upMultiplier !== 1 && upMultiplier}
                </Button>
                <Button
                    variant={"contained"}
                    color="secondary"
                    sx={{ width: "70vw", fontSize: "20px" }}
                    onClick={handleRepsClick(-downMultiplier)}
                >
                    - {downMultiplier !== 1 && downMultiplier}
                </Button>
            </Stack>
            {/*</Box>*/}
            {showMultiplier && (
                <Paper
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    elevation={12}
                >
                    <Box
                        overflow={"hidden"}
                        width={1}
                        display={"flex"}
                        justifyContent={"space-between"}
                        boxShadow={"0px 1px 1px rgba(0, 0, 0,)"}
                    >
                        <Button
                            variant={
                                multiplier === 1 ? "contained" : "outlined"
                            }
                            sx={{
                                width: "100%",
                                border: "none",
                                borderRadius: 0,
                                fontSize: "1rem",
                            }}
                            onClick={handleMutliplierClick(1)}
                        >
                            x1
                        </Button>
                        <Button
                            variant={
                                multiplier === 10 ? "contained" : "outlined"
                            }
                            sx={{
                                width: "100%",
                                border: "none",
                                borderRadius: 0,
                                fontSize: "1rem",
                            }}
                            onClick={handleMutliplierClick(10)}
                        >
                            x10
                        </Button>
                        <Button
                            variant={
                                multiplier === 50 ? "contained" : "outlined"
                            }
                            sx={{
                                width: "100%",
                                // backgroundColor:
                                //     multiplier === 50 ? "gray" : "lightgray",
                                border: "none",
                                borderRadius: 0,
                                fontSize: "1rem",
                            }}
                            onClick={handleMutliplierClick(50)}
                        >
                            x50
                        </Button>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default RemoteClassic;
