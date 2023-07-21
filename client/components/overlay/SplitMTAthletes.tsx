import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import { useMemo } from "react";
import { useCompetitionContext } from "../../context/competition";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
    getRoundScores,
    roundsScores,
    splitMTscore,
} from "../../utils/splitMTscore";

interface Props {
    station: DisplayFullStation;
    workout: Workout;
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    wodState?: number;
    round: number;
    rest: boolean;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#dedcdc";

const SplitMTAthletes = ({
    station,
    workout,
    allTotalReps,
    wodState = 2,
    round,
    rest,
}: Props) => {
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
    });
    const competition = useCompetitionContext();

    const repsCompleted = useMemo(
        () => splitMTscore(station.scores?.wodSplit || [], workout),
        [station?.scores, workout.workoutId]
    );

    const rank = useMemo(
        () => allTotalReps.findIndex((reps) => reps === repsCompleted) + 1,
        [allTotalReps, repsCompleted]
    );
    console.log(allTotalReps);

    const currentRoundReps = useMemo(
        () =>
            workout.workoutId
                ? getRoundScores(
                      station.scores?.wodSplit || [],
                      round,
                      workout.workoutId
                  )
                : null,
        [station?.scores, workout.workoutId, round]
    );

    const allRoundSuccess = useMemo(
        () =>
            workout.workoutId
                ? [0, 1, 2].map((round) => {
                      const scores = getRoundScores(
                          station.scores?.wodSplit || [],
                          round,
                          workout.workoutId!
                      );
                      return scores.get(0) === scores.get(4);
                  })
                : [false, false, false],
        [station?.scores, workout.workoutId, round]
    );

    const scoreOfRounds = useMemo(
        () =>
            station.scores?.wodSplit
                ? roundsScores(station.scores?.wodSplit, workout)
                : [0, 0, 0],
        [station?.scores, workout.workoutId]
    );

    return (
        <Box width={1}>
            {wodState < 3 && workout.options?.viewMovement !== "none" && (
                <Box
                    textAlign={"center"}
                    display={"flex"}
                    justifyContent={"space-around"}
                    width={0.85}
                    height={25}
                    ml={"auto"}
                    borderRadius={"5px 5px 0 0"}
                    sx={{ backgroundColor: "#b0b0b0" }}
                    px={1}
                >
                    {rest
                        ? [0, 1, 2].map((round) => (
                              <Box
                                  display={"flex"}
                                  ref={parent}
                                  width={1 / 3}
                                  borderLeft={
                                      round === 0 ? "none" : "1px solid #919191"
                                  }
                                  borderRight={
                                      round === 2 ? "none" : "1px solid #919191"
                                  }
                                  justifyContent={"center"}
                                  // my={-2}
                              >
                                  {!!scoreOfRounds[round] && (
                                      <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                      >
                                          <Typography
                                              lineHeight={1}
                                              color={"black"}
                                              fontSize={"1.5rem"}
                                              fontFamily={"bebasNeue"}
                                              // sx={{ textShadow: "0px 0px 15px black" }}
                                          >
                                              R{round + 1}:
                                          </Typography>

                                          <Typography
                                              pl={0.3}
                                              lineHeight={1}
                                              color={"white"}
                                              fontSize={"1.5rem"}
                                              fontFamily={"bebasNeue"}
                                              sx={{
                                                  textShadow:
                                                      "0px 0px 15px black",
                                              }}
                                          >
                                              {scoreOfRounds[round]}
                                          </Typography>
                                          <Typography
                                              fontSize={"0.8rem"}
                                              fontFamily={"bebasNeue"}
                                              // sx={{
                                              //     textShadow:
                                              //         "0px 0px 15px black",
                                              // }}
                                              my={"auto"}
                                          >
                                              {allRoundSuccess[round]
                                                  ? "✅"
                                                  : "❌"}
                                          </Typography>
                                      </Box>
                                  )}
                              </Box>
                          ))
                        : [0, 2, 4].map((repIndex) => (
                              <Box
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={"baseline"}
                                  width={1 / 3}
                                  ref={parent}
                                  pt={0.2}
                                  borderLeft={
                                      repIndex === 0
                                          ? "none"
                                          : "1px solid #919191"
                                  }
                                  borderRight={
                                      repIndex === 4
                                          ? "none"
                                          : "1px solid #919191"
                                  }
                              >
                                  {!!currentRoundReps?.get(repIndex) && (
                                      <>
                                          <Typography
                                              lineHeight={1}
                                              color={"black"}
                                              fontSize={"1.5rem"}
                                              fontFamily={"bebasNeue"}
                                              // sx={{ textShadow: "0px 0px 15px black" }}
                                          >
                                              {repIndex === 2 ? "MU" : "DL"}:
                                          </Typography>
                                          <Typography
                                              lineHeight={1}
                                              px={1}
                                              color={"white"}
                                              fontSize={"1.5rem"}
                                              fontFamily={"bebasNeue"}
                                              sx={{
                                                  textShadow:
                                                      "0px 0px 15px black",
                                              }}
                                          >
                                              {currentRoundReps?.get(repIndex)}
                                          </Typography>
                                      </>
                                  )}
                              </Box>
                          ))}
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
                            {repsCompleted}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SplitMTAthletes;
