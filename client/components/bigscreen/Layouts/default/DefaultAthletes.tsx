import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import useWebappWorkout from "../../../../hooks/useWebappWorkout";
import { useMemo } from "react";
import { useCompetitionContext } from "../../../../context/competition";

interface Props {
    station: DisplayFullStation;
    height: number;
    workout: Workout;
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    wodState?: number;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";
const BASE_WIDTH = 0.45;

const DefaultAthletes = ({
    station,
    height,
    workout,
    repsOfFirst,
    allTotalReps,
    firstScore,
    participantTextRows = 2,
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
        <Box
            key={station.laneNumber}
            width={1}
            height={height}
            borderRadius={"10px"}
            display={"flex"}
            position={"relative"}
            overflow={"hidden"}
            sx={{
                background: `${
                    rank === 1
                        ? `linear-gradient(90deg, ${
                              competition?.primaryColor
                          } 0%, ${competition?.secondaryColor} ${
                              BASE_WIDTH * 100 +
                              (endTime
                                  ? 100
                                  : ((100 * repsCompleted) / totalRepetitions) *
                                    (1 - BASE_WIDTH)) -
                              (repsCompleted / totalRepetitions === 1 ? 0 : 0.5)
                          }%, ${BG_COLOR} ${
                              endTime
                                  ? 100
                                  : (100 * repsCompleted) / totalRepetitions
                          }%)`
                        : `linear-gradient(90deg, ${
                              rank === 1 ? competition?.primaryColor : BAR_COLOR
                          } ${BASE_WIDTH * 100}%, ${BAR_COLOR} ${
                              BASE_WIDTH * 100 +
                              (endTime
                                  ? 100
                                  : ((100 * repsCompleted) / totalRepetitions) *
                                    (1 - BASE_WIDTH)) -
                              (repsCompleted / totalRepetitions === 1 ? 0 : 0.5)
                          }%, ${BG_COLOR} ${
                              endTime
                                  ? 100
                                  : (100 * repsCompleted) / totalRepetitions
                          }%)`
                }`,
            }}
        >
            <Box
                width={0.05}
                p={1}
                borderRight={`2px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography fontSize={50} fontFamily={"bebasNeue"}>
                    {rank}
                </Typography>
            </Box>
            <Box
                width={0.4}
                p={1}
                position={"relative"}
                display={"flex"}
                gap={1.3}
            >
                <Typography
                    lineHeight={"2.5rem"}
                    maxHeight={"6rem"}
                    fontSize={"2rem"}
                    fontFamily={"bebasNeue"}
                >
                    #{station.laneNumber}
                </Typography>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                >
                    <Typography
                        lineHeight={0.9}
                        maxHeight={"6rem"}
                        fontSize={50}
                        fontFamily={"bebasNeue"}
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        my={"auto"}
                        maxWidth={"100%"}
                        noWrap={!!firstScore}
                    >
                        {station.participant.slice(0, 40)}
                    </Typography>
                    {firstScore && (
                        <Typography
                            lineHeight={0.7}
                            fontSize={"3rem"}
                            fontFamily={"bebasNeue"}
                            color={"white"}
                            sx={{ textShadow: "0px 0px 15px black" }}
                        >
                            {firstScore}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box display={"flex"} justifyContent={"space-evenly"} flexGrow={2}>
                {endTime ? (
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Typography
                            px={1}
                            pt={0.5}
                            color={"white"}
                            fontSize={"4.5rem"}
                            fontFamily={"bebasNeue"}
                            borderRadius={"10px"}
                            sx={{ textShadow: "0px 0px 15px black" }}
                        >
                            {endTime}
                        </Typography>
                    </Box>
                ) : wodState < 3 ? (
                    workout.options?.viewMovement !== "none" && (
                        <>
                            <Box
                                py={1}
                                textAlign={"center"}
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"space-around"}
                                width={0.8}
                            >
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                >
                                    <Typography
                                        px={1}
                                        pt={0.5}
                                        color={"white"}
                                        fontSize={"2.4rem"}
                                        lineHeight={"2.1rem"}
                                        fontFamily={"bebasNeue"}
                                        borderRadius={"10px"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                    >
                                        {currentMovementTotalReps}{" "}
                                        {currentMovement}
                                    </Typography>
                                </Box>
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                >
                                    <Typography
                                        px={1}
                                        pt={0.5}
                                        color={"white"}
                                        fontSize={"2.4rem"}
                                        lineHeight={"2.4rem"}
                                        fontFamily={"bebasNeue"}
                                        borderRadius={"10px"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                    >
                                        {currentMovementReps}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={0.2}
                            >
                                {rank !== 1 && !endTime && (
                                    <Typography
                                        px={1}
                                        color={"white"}
                                        fontSize={"3rem"}
                                        lineHeight={"2.4rem"}
                                        fontFamily={"bebasNeue"}
                                        borderRadius={"10px"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                    >
                                        {repsCompleted - repsOfFirst}
                                    </Typography>
                                )}
                            </Box>
                        </>
                    )
                ) : (
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Typography
                            px={1}
                            pt={0.5}
                            color={"white"}
                            fontSize={"4.5rem"}
                            fontFamily={"bebasNeue"}
                            borderRadius={"10px"}
                            sx={{ textShadow: "0px 0px 15px black" }}
                        >
                            {repsCompleted} reps
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DefaultAthletes;
