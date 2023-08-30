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
    // allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    wodState?: number;
    results: {
        workoutId: string;
        result:
            | {
                  rank: number;
                  finalScore: string | number;
                  finished: boolean;
                  participantId: number;
              }
            | undefined;
    }[];
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";
const BASE_WIDTH = 0.47;

const DefaultAthletes = ({
    station,
    height,
    workout,
    repsOfFirst,
    wodState = 2,
    results,
}: Props) => {
    const competition = useCompetitionContext();

    const workoutType = workout?.options?.wodtype;

    const repsCompleted = useMemo(() => {
        return (
            station?.scores?.["wodClassic"]
                ?.filter((score) => score.index === workout?.workoutId)
                .reduce((total, rep) => total + rep.rep, 0) || 0
        );
    }, [station?.scores, workout?.workoutId]);

    const endTime = station?.scores?.endTimer.find(
        (score) => score.index === workout?.workoutId
    )?.time;

    const rank = results.find((r) => r.workoutId === workout?.workoutId)?.result
        ?.rank;

    const otherResults = results.filter(
        (r) =>
            r.workoutId !== workout?.workoutId &&
            (r.result?.finished || +(r.result?.finalScore || 0) > 0)
    );

    const {
        totalRepetitions,
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        round,
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
                          } 0%, ${
                              workoutType === "amrap"
                                  ? `${competition?.secondaryColor} 100%)`
                                  : `${competition?.secondaryColor} ${
                                        BASE_WIDTH * 100 +
                                        (endTime
                                            ? 100
                                            : ((100 * repsCompleted) /
                                                  totalRepetitions) *
                                              (1 - BASE_WIDTH)) -
                                        (repsCompleted / totalRepetitions === 1
                                            ? 0
                                            : 0.5)
                                    }%, ${BG_COLOR} ${
                                        endTime
                                            ? 100
                                            : (100 * repsCompleted) /
                                              totalRepetitions
                                    }%)`
                          }`
                        : `linear-gradient(90deg, ${BAR_COLOR} ${
                              BASE_WIDTH * 100
                          }%, ${
                              workoutType === "amrap"
                                  ? `${BAR_COLOR} 100%)`
                                  : `${BAR_COLOR} ${
                                        BASE_WIDTH * 100 +
                                        (endTime
                                            ? 100
                                            : ((100 * repsCompleted) /
                                                  totalRepetitions) *
                                              (1 - BASE_WIDTH)) -
                                        (repsCompleted / totalRepetitions === 1
                                            ? 0
                                            : 0.5)
                                    }%, ${BG_COLOR} ${
                                        endTime
                                            ? 100
                                            : (100 * repsCompleted) /
                                              totalRepetitions
                                    }%)`
                          }`
                }`,
            }}
        >
            <Box
                width={0.075}
                px={1}
                borderRight={`4px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography
                    fontSize={"3.6rem"}
                    fontFamily={"bebasNeue"}
                    fontWeight={800}
                >
                    {rank}
                </Typography>
            </Box>
            <Box
                width={BASE_WIDTH}
                p={1}
                position={"relative"}
                display={"flex"}
                gap={1.3}
            >
                <Typography
                    lineHeight={"2.5rem"}
                    maxHeight={"6rem"}
                    fontSize={"3rem"}
                    fontFamily={"bebasNeue"}
                    width={0.14}
                >
                    #{station.laneNumber}
                </Typography>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    height={1}
                >
                    <Typography
                        lineHeight={0.9}
                        maxHeight={"6rem"}
                        fontSize={
                            station.participant.length > 26
                                ? "2.3rem"
                                : "2.3rem"
                        }
                        fontFamily={"bebasNeue"}
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        my={"auto"}
                        maxWidth={"100%"}
                        noWrap={otherResults.length > 0}
                    >
                        {station.participant.slice(0, 50)}
                    </Typography>
                    <Box display={"flex"} gap={4}>
                        {otherResults.length > 0 &&
                            otherResults.map((result, index) => (
                                <Box
                                    display={"flex"}
                                    gap={2}
                                    alignItems={"baseline"}
                                >
                                    <Typography
                                        lineHeight={0.75}
                                        fontSize={"2rem"}
                                        fontFamily={"bebasNeue"}
                                        color={"gray"}
                                        fontWeight={900}
                                        sx={{
                                            textShadow:
                                                "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",
                                        }}
                                    >
                                        rank {index + 1} :
                                    </Typography>
                                    <Typography
                                        lineHeight={0.75}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        color={"white"}
                                        fontWeight={900}
                                        sx={{
                                            textShadow:
                                                "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",
                                        }}
                                    >
                                        {result.result?.rank}
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
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
                            lineHeight={1}
                            px={1}
                            pt={0.5}
                            color={"white"}
                            fontSize={"4.5rem"}
                            fontFamily={"bebasNeue"}
                            borderRadius={"10px"}
                            fontWeight={900}
                            sx={{
                                textShadow:
                                    "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",
                            }}
                        >
                            {endTime}
                        </Typography>
                    </Box>
                ) : wodState < 3 ? (
                    workout?.options?.viewMovement !== "none" && (
                        <>
                            <Box
                                // py={1}
                                textAlign={"center"}
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"start"}
                                width={0.8}
                                // gap={1}
                            >
                                {workoutType === "amrap" && (
                                    <Box
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                        borderRadius={"10px"}
                                        px={1}
                                        maxHeight={"5rem"}
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
                                            R: {round}
                                        </Typography>
                                    </Box>
                                )}
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    sx={{ backgroundColor: BG_COLOR }}
                                    borderRadius={"10px"}
                                    px={1}
                                    maxHeight={"4rem"}
                                >
                                    <Typography
                                        px={1}
                                        pt={0.5}
                                        color={"white"}
                                        fontSize={"3.2rem"}
                                        lineHeight={"2.8rem"}
                                        fontFamily={"bebasNeue"}
                                    >
                                        {currentMovementReps}
                                    </Typography>
                                    {/*</Box>*/}
                                    {/*<Box*/}
                                    {/*    display={"flex"}*/}
                                    {/*    justifyContent={"center"}*/}
                                    {/*    alignItems={"center"}*/}
                                    {/*>*/}
                                    <Typography
                                        px={1}
                                        pt={0.5}
                                        color={"white"}
                                        fontSize={"2.4rem"}
                                        lineHeight={"2.4rem"}
                                        fontFamily={"bebasNeue"}
                                        // borderRadius={"10px"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                    >
                                        /
                                    </Typography>
                                    {/*</Box>*/}
                                    {/*<Box*/}
                                    {/*    display={"flex"}*/}
                                    {/*    justifyContent={"center"}*/}
                                    {/*    alignItems={"center"}*/}
                                    {/*>*/}
                                    <Typography
                                        px={1}
                                        pt={0.5}
                                        color={"white"}
                                        fontSize={"3.2rem"}
                                        lineHeight={"2.8rem"}
                                        fontFamily={"bebasNeue"}
                                        borderRadius={"10px"}
                                        sx={{ backgroundColor: BG_COLOR }}
                                    >
                                        {currentMovementTotalReps}
                                    </Typography>
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
                                        {currentMovement}
                                    </Typography>
                                </Box>

                                {/*<Box*/}
                                {/*    display={"flex"}*/}
                                {/*    justifyContent={"center"}*/}
                                {/*    alignItems={"center"}*/}
                                {/*>*/}
                                {/*    <Typography*/}
                                {/*        px={1}*/}
                                {/*        pt={0.5}*/}
                                {/*        color={"white"}*/}
                                {/*        fontSize={"2.4rem"}*/}
                                {/*        lineHeight={"2.4rem"}*/}
                                {/*        fontFamily={"bebasNeue"}*/}
                                {/*        borderRadius={"10px"}*/}
                                {/*        sx={{ backgroundColor: BG_COLOR }}*/}
                                {/*    >*/}
                                {/*        {currentMovementReps}*/}
                                {/*    </Typography>*/}
                                {/*</Box>*/}
                            </Box>
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                {rank !== 1 && !endTime && (
                                    <Box
                                        sx={{ backgroundColor: BG_COLOR }}
                                        borderRadius={"10px"}
                                        px={1}
                                        maxHeight={"5rem"}
                                    >
                                        <Typography
                                            px={1}
                                            py={1}
                                            color={"white"}
                                            fontSize={"3rem"}
                                            lineHeight={"2.4rem"}
                                            fontFamily={"bebasNeue"}
                                            borderRadius={"10px"}
                                        >
                                            {repsCompleted - repsOfFirst}
                                        </Typography>
                                    </Box>
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
                            lineHeight={1}
                            px={1}
                            pt={0.5}
                            color={"white"}
                            fontSize={"4.5rem"}
                            fontFamily={"bebasNeue"}
                            fontWeight={900}
                            sx={{
                                textShadow:
                                    "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",
                            }}
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
