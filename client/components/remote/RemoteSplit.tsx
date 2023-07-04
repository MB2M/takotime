import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import splitMTscore from "../../utils/splitMTscore";

interface Props {
    workout: Workout;
    sendMessage: (message: string) => void;
    laneNumber: number;
    station?: BaseStation2 | null;
    participantId: string;
}

const RemoteSplit = ({
    workout,
    sendMessage,
    laneNumber,
    station,
    participantId,
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
                },
            })
        );
    };

    const roundScore = useMemo(() => {
        switch (workout.layout) {
            case "splitMT":
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
            <Typography
                textAlign="center"
                fontSize={"4.5rem"}
                fontFamily={"CantoraOne"}
            >
                {roundScore}
            </Typography>
            <Box>
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
            <Box
                display={"flex"}
                flexDirection={"column"}
                gap={1}
                justifyContent={"center"}
                mt={"auto"}
            >
                {movements.map((movement, index) => (
                    <Box
                        key={index}
                        display={"flex"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Button
                            onClick={handleRepsClick(-1, index)}
                            variant="contained"
                            color="primary"
                            sx={{
                                width: "10px",
                                height: "30px",
                                borderRadius: "5px",
                                backgroundColor: "white",
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            -
                        </Button>
                        <Typography textAlign="center">
                            {repsCompleted?.get(index)} {movement}
                        </Typography>
                        <Button
                            onClick={handleRepsClick(1, index)}
                            variant="contained"
                            color="primary"
                            sx={{
                                width: "10%",
                                height: "10%",
                                borderRadius: "5px",
                                backgroundColor: "white",
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            +
                        </Button>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default RemoteSplit;
