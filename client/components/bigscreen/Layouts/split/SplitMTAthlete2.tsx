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
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    round: number;
    rest: boolean;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";

const SplitMTAthlete2 = ({
    station,
    height,
    workout,
    // repsOfFirst,
    allTotalReps,
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
                // width={0.05}
                px={1}
                borderRight={`2px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography fontSize={40} fontFamily={"bebasNeue"}>
                    {rank}
                </Typography>
            </Box>

            <Box display={"flex"} width={1} alignItems={"center"}>
                <Box
                    px={1}
                    position={"relative"}
                    display={"flex"}
                    gap={1.3}
                    alignItems={"center"}
                    minWidth={0.45}
                    maxWidth={0.45}
                >
                    <Typography
                        lineHeight={"2.5rem"}
                        maxHeight={"6rem"}
                        fontSize={"2rem"}
                        fontFamily={"bebasNeue"}
                    >
                        #{station.laneNumber}
                    </Typography>
                    <Typography
                        lineHeight={0.9}
                        maxHeight={"6rem"}
                        fontSize={50}
                        fontFamily={"bebasNeue"}
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        noWrap
                    >
                        {station.participant.slice(0, 40)}
                    </Typography>
                    {!rest && (
                        <Typography
                            lineHeight={0.9}
                            maxHeight={"6rem"}
                            fontSize={25}
                            fontFamily={"bebasNeue"}
                            sx={{ textShadow: "0px 0px 15px black" }}
                        >
                            {!!currentRoundReps?.get(0) &&
                                currentRoundReps?.get(4) ===
                                    currentRoundReps?.get(0) &&
                                "✅"}
                        </Typography>
                    )}
                </Box>
                <Box
                    width={1}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    {rest
                        ? [0, 1, 2].map((round) => (
                              <Box
                                  display={"flex"}
                                  width={0.33}
                                  ref={parent}
                                  // my={-2}
                              >
                                  {!!scoreOfRounds[round] && (
                                      <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                      >
                                          <Stack
                                              alignItems={"center"}
                                              position={"relative"}
                                          >
                                              <Typography
                                                  lineHeight={1}
                                                  px={1}
                                                  color={"black"}
                                                  fontSize={"2.5rem"}
                                                  fontFamily={"bebasNeue"}
                                                  position={"relative"}
                                                  // sx={{ textShadow: "0px 0px 15px black" }}
                                              >
                                                  R{round + 1}:
                                              </Typography>
                                              <Typography
                                                  position={"absolute"}
                                                  top={-12}
                                                  left={-5}
                                                  fontSize={15}
                                                  fontFamily={"bebasNeue"}
                                                  sx={{
                                                      textShadow:
                                                          "0px 0px 15px black",
                                                  }}
                                                  my={"auto"}
                                              >
                                                  {allRoundSuccess[round]
                                                      ? "✅"
                                                      : "❌"}
                                              </Typography>
                                          </Stack>
                                          <Typography
                                              lineHeight={1}
                                              px={0.7}
                                              color={"white"}
                                              fontSize={"3.5rem"}
                                              fontFamily={"bebasNeue"}
                                              sx={{
                                                  textShadow:
                                                      "0px 0px 15px black",
                                              }}
                                          >
                                              {scoreOfRounds[round]}
                                          </Typography>
                                      </Box>
                                  )}
                              </Box>
                          ))
                        : [0, 2, 4].map((repIndex) => (
                              <Box
                                  display={"flex"}
                                  alignItems={"baseline"}
                                  width={0.3}
                                  ref={parent}
                              >
                                  {!!currentRoundReps?.get(repIndex) && (
                                      <>
                                          <Typography
                                              lineHeight={1}
                                              color={"black"}
                                              fontSize={"2.5rem"}
                                              fontFamily={"bebasNeue"}
                                              // sx={{ textShadow: "0px 0px 15px black" }}
                                          >
                                              {repIndex === 2 ? "MU" : "DL"}:
                                          </Typography>
                                          <Typography
                                              lineHeight={1}
                                              px={1}
                                              color={"white"}
                                              fontSize={"3.5rem"}
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
                <Box ml={"auto"} px={2} py={0.8}>
                    <Typography
                        p={1}
                        color={"white"}
                        fontSize={"3rem"}
                        lineHeight={"2.4rem"}
                        fontFamily={"bebasNeue"}
                        borderRadius={"10px"}
                        sx={{ backgroundColor: BG_COLOR }}
                    >
                        {repsCompleted}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SplitMTAthlete2;
