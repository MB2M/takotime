import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMemo } from "react";
import { useCompetitionContext } from "../../../../context/competition";
import {
    getRoundScores,
    roundsScores,
    splitMTscore,
} from "../../../../utils/splitMTscore";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
    station: DisplayFullStation;
    height: number;
    workout: Workout;
    allTotalReps: (number | string)[];
    round: number;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";

const SplitAthlete = ({
    station,
    height,
    workout,
    allTotalReps,
    round,
}: Props) => {
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
    });
    const competition = useCompetitionContext();

    const allScores = station?.scores?.wodSplit
        .sort((a, b) => a.repIndex - b.repIndex)
        .map((score) => score.rep);

    const repsCompleted = useMemo(
        () =>
            station?.scores?.wodSplit
                .filter((rep) => rep.index === workout.workoutId)
                .reduce((total, score) => total + +score.rep, 0) || 0,
        [station?.scores, workout.workoutId]
    );

    const rank = useMemo(
        () => allTotalReps.findIndex((reps) => reps === repsCompleted) + 1,
        [allTotalReps, repsCompleted]
    );

    const currentRoundReps = useMemo(
        () =>
            workout.workoutId
                ? getRoundScores(
                      station.scores?.wodSplit || [],
                      0,
                      workout.workoutId
                  )
                : null,
        [station?.scores, workout.workoutId, round]
    );

    const endTime = station?.scores?.endTimer.find(
        (score) => score.index === workout.workoutId
    )?.time;

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
                        ? `linear-gradient(90deg, ${competition?.primaryColor} 0%, ${competition?.secondaryColor} 100%)`
                        : `linear-gradient(90deg, ${BAR_COLOR} 0%, ${BAR_COLOR} 100%)`
                }`,
            }}
        >
            <Box
                width={0.075}
                p={1}
                borderRight={`2px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    // backgroundColor: "#101010",
                    backgroundColor: rank === 1 ? "none" : BG_COLOR,
                    color: rank === 1 ? "black" : competition?.primaryColor,
                }}
            >
                <Typography
                    fontSize={"3.6rem"}
                    fontFamily={"bebasNeue"}
                    fontWeight={800}
                >
                    {rank}
                </Typography>
            </Box>

            <Box display={"flex"} width={1}>
                <Box
                    minWidth={0.4}
                    width={0.4}
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
                    >
                        #{station.laneNumber}
                    </Typography>
                    <Typography
                        lineHeight={0.9}
                        maxHeight={"6rem"}
                        fontSize={
                            station.participant.length > 34 ? "2.3rem" : "3rem"
                        }
                        fontFamily={"bebasNeue"}
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        my={"auto"}
                        maxWidth={"100%"}
                    >
                        {station.participant.slice(0, 50)}
                    </Typography>
                </Box>
                <Box
                    width={0.55}
                    flexShrink={1}
                    display={"flex"}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    gap={2}
                >
                    {workout.flow.main.movements?.map((movement, index) => (
                        <Box
                            display={"flex"}
                            alignItems={"top"}
                            width={0.3}
                            ref={parent}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            height={0.9}
                        >
                            {!!currentRoundReps?.get(index) && (
                                <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    // alignItems={"center"}
                                    textAlign={"center"}
                                    height={1}
                                    gap={1}
                                >
                                    <Typography
                                        lineHeight={1}
                                        color={"black"}
                                        fontSize={"2rem"}
                                        fontFamily={"bebasNeue"}
                                        mt={"auto"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        {movement}
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3rem"}
                                        fontFamily={"bebasNeue"}
                                        fontWeight={900}
                                        sx={{
                                            textShadow:
                                                "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                                            // "-webkit-text-stroke-width": "3px",
                                            // "-webkit-text-stroke-color":
                                            //     "black",
                                        }}
                                    >
                                        {currentRoundReps?.get(index)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box ml={"auto"} px={2} py={0.8} width={0.15} my={"auto"}>
                    <Typography
                        p={1}
                        color={"white"}
                        fontSize={"3.5rem"}
                        lineHeight={"2.4rem"}
                        fontFamily={"bebasNeue"}
                        borderRadius={"10px"}
                        textAlign="right"
                        sx={{ backgroundColor: BG_COLOR }}
                    >
                        {repsCompleted}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SplitAthlete;
