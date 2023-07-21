import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { splitMTscore } from "../../utils/splitMTscore";
import { Stack } from "@mui/system";

interface Props {
    workout: Workout;
    sendMessage: (message: string) => void;
    laneNumber: number;
    station?: BaseStation2 | null;
    participantId: string;
    category: string;
}

const RemoteSplit = ({
    workout,
    sendMessage,
    laneNumber,
    station,
    participantId,
    category,
}: Props) => {
    const selectedWorkoutId = workout.workoutId;
    const rounds = workout.options?.rounds || 1;

    const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
    const handleRepsClick = (value: number, movementIndex: number) => () => {
        sendMessage(
            JSON.stringify({
                topic: "newRep",
                data: {
                    station: laneNumber,
                    value: value,
                    wodIndex: selectedWorkoutId,
                    participantId,
                    movementIndex,
                    round: selectedRoundIndex,
                    category,
                },
            })
        );
    };

    const roundScore = useMemo(() => {
        switch (true) {
            case workout.layout?.includes("splitMT"):
                return splitMTscore(
                    station?.scores.wodSplit.filter(
                        (rep) =>
                            rep.round === selectedRoundIndex &&
                            rep.index === selectedWorkoutId
                    ) || [],
                    workout
                );
            default:
                return station?.scores.wodSplit
                    .filter(
                        (rep) =>
                            rep.round === selectedRoundIndex &&
                            rep.index === selectedWorkoutId
                    )
                    .reduce((total, score) => total + +score.rep, 0);
        }
    }, [selectedRoundIndex, station?.scores.wodSplit, workout.layout]);

    const repsCompleted = useMemo(() => {
        return station?.scores?.["wodSplit"]
            ?.filter(
                (score) =>
                    score.index === selectedWorkoutId &&
                    score.round === selectedRoundIndex
            )
            .reduce(
                (acc, score) =>
                    acc.set(
                        score.repIndex,
                        (acc.get(score.repIndex) || 0) + score.rep
                    ),
                new Map()
            );
    }, [station?.scores, selectedWorkoutId, selectedRoundIndex]);

    const movements = [
        ...workout.flow.buyIn.movements,
        ...workout.flow.main.movements,
        ...workout.flow.buyOut.movements,
    ];

    return (
        <>
            <Box display={"flex"} justifyContent={"space-around"}>
                {rounds > 1 &&
                    Array.from({ length: rounds }).map((_, index) => (
                        <Button
                            key={index}
                            variant={
                                selectedRoundIndex === index
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => setSelectedRoundIndex(index)}
                        >
                            score {index + 1}
                        </Button>
                    ))}
            </Box>
            <Typography
                textAlign="center"
                fontSize={"4.5rem"}
                fontFamily={"CantoraOne"}
            >
                {roundScore}
            </Typography>
            <Stack
                gap={2}
                justifyContent={"center"}
                mt={"auto"}
                alignItems={"center"}
            >
                {movements.map((movement, index) => (
                    <Box
                        key={index}
                        display={"flex"}
                        justifyContent={"space-between"}
                        borderRadius={50}
                        overflow={"hidden"}
                        width={0.95}
                    >
                        <Box display={"flex"}>
                            <Button
                                onClick={handleRepsClick(-1, index)}
                                variant="contained"
                                color="secondary"
                                sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRadius: 0,
                                    border: "none",
                                    fontSize: "1.5rem",
                                }}
                            >
                                -
                            </Button>
                        </Box>
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            width={1}
                            alignItems={"center"}
                            p={1}
                            borderTop={"1px solid #ccc"}
                            borderBottom={"1px solid #ccc"}
                        >
                            <Typography
                                textAlign="center"
                                width={0.2}
                                fontFamily={"BebasNeue"}
                                fontSize={"1.4rem"}
                            >
                                {repsCompleted?.get(index) || 0}
                            </Typography>
                            <Typography
                                textAlign="start"
                                fontFamily={"BebasNeue"}
                                fontSize={"1.4rem"}
                                flexGrow={1}
                            >
                                {movement}
                            </Typography>
                        </Box>
                        <Button
                            onClick={handleRepsClick(1, index)}
                            variant={"contained"}
                            sx={{
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: 0,
                                border: "none",
                                fontSize: "1.5rem",
                            }}
                        >
                            +
                        </Button>
                    </Box>
                ))}
            </Stack>
        </>
    );
};

export default RemoteSplit;
