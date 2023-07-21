import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import { useMemo } from "react";
import { useCompetitionContext } from "../../context/competition";
import useWebappWorkout from "../../hooks/useWebappWorkout";

interface Props {
    station: DisplayFullStation;
    workout: Workout;
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    wodState?: number;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#dedcdc";
const DefaultAthletes = ({
    station,
    workout,
    repsOfFirst,
    allTotalReps,
    firstScore,
    wodState = 2,
}: Props) => {
    const competition = useCompetitionContext();

    const repsCompleted = useMemo(() => {
        return (
            station?.scores?.["wodClassic"]
                ?.filter((score) => score.index === workout.workoutId)
                .reduce((total, rep) => total + rep.rep, 0) || 0
        );
    }, [station?.scores, workout.workoutId]);

    const endTime = firstScore
        ? station.scores?.endTimer[1]?.time
        : station.scores?.endTimer.at(-1)?.time;

    const rank = useMemo(
        () =>
            allTotalReps.findIndex((reps) =>
                endTime ? reps === endTime : reps === repsCompleted
            ) + 1,
        [allTotalReps, endTime, repsCompleted]
    );

    const {
        totalRepetitions,
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        round: currentRound,
        wodType: workoutType,
    } = useWebappWorkout(workout, repsCompleted);

    return (
        <Box width={1}>
            {wodState < 3 && workout.options?.viewMovement !== "none" && (
                <Box
                    textAlign={"center"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-around"}
                    width={0.85}
                    ml={"auto"}
                    borderRadius={"5px 5px 0 0"}
                    sx={{ backgroundColor: "#b0b0b0" }}
                    py={0.2}
                >
                    <Typography
                        lineHeight={1}
                        px={1}
                        color={"black"}
                        fontSize={"1.5rem"}
                        fontFamily={"bebasNeue"}
                    >
                        {currentMovementReps} / {currentMovementTotalReps}{" "}
                        {currentMovement}
                    </Typography>
                </Box>
            )}

            <Box
                key={station.laneNumber}
                width={1}
                borderRadius={"4px"}
                display={"flex"}
                position={"relative"}
                overflow={"hidden"}
                border={rank === 1 ? "2px solid" : "none"}
                sx={{
                    // background: `${
                    //     rank === 1
                    //         ? `linear-gradient(270deg, ${competition?.primaryColor} 0%, ${competition?.secondaryColor} 100%
                    //           )`
                    //         : BAR_COLOR
                    // }`,
                    backgroundColor: BAR_COLOR,
                    borderImageSlice: 1,
                    borderImageSource:
                        rank === 1
                            ? `linear-gradient(to right, ${competition?.primaryColor} 0%, ${competition?.secondaryColor} 100%)`
                            : "none",
                }}
            >
                <Box
                    width={0.1}
                    px={1}
                    pt={0.5}
                    borderRight={`2px solid ${BG_COLOR}`}
                    position={"relative"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ background: `${BG_COLOR}` }}
                >
                    <Typography
                        fontSize={"1.8rem"}
                        fontFamily={"bebasNeue"}
                        color={"white"}
                    >
                        {rank}
                    </Typography>
                </Box>
                <Stack
                    px={1}
                    position={"relative"}
                    display={"flex"}
                    justifyContent={"center"}
                    maxWidth={0.6}
                >
                    <Typography
                        fontSize={"1.2rem"}
                        fontFamily={"bebasNeue"}
                        lineHeight={0.8}
                        color={"#333333"}
                    >
                        Lane {station.laneNumber}
                    </Typography>
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        overflow={"hidden"}
                    >
                        <Typography
                            lineHeight={1}
                            fontSize={"1.4rem"}
                            fontFamily={"bebasNeue"}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            my={"auto"}
                            maxWidth={"100%"}
                            noWrap
                        >
                            {station.participant.slice(0, 40)}
                        </Typography>
                    </Box>
                </Stack>
                <Box
                    display={"flex"}
                    justifyContent={"space-evenly"}
                    ml={"auto"}
                >
                    {endTime ? (
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Typography
                                px={1}
                                pt={0.5}
                                color={"black"}
                                fontSize={"1.4rem"}
                                fontFamily={"bebasNeue"}
                                borderRadius={"10px"}
                                // sx={{ textShadow: "0px 0px 15px black" }}
                            >
                                {endTime}
                            </Typography>
                        </Box>
                    ) : wodState < 3 ? (
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            width={0.2}
                        >
                            {rank !== 1 && !endTime && (
                                <Typography
                                    px={1}
                                    color={"black"}
                                    fontSize={"1.4rem"}
                                    fontFamily={"bebasNeue"}
                                    borderRadius={"10px"}
                                    fontWeight={"bold"}
                                >
                                    {repsCompleted - repsOfFirst}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Typography
                                px={1}
                                pt={0.5}
                                color={"black"}
                                fontSize={"1.5rem"}
                                fontFamily={"bebasNeue"}
                                borderRadius={"10px"}
                                // sx={{ textShadow: "0px 0px 15px black" }}
                                noWrap
                            >
                                {repsCompleted} reps
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DefaultAthletes;
