import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import DefaultAthletes from "./DefaultAthletes";
import { getTotalClassicReps } from "../../../../utils/scoring";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import { Typography } from "@mui/material";
import { getTopScore } from "../../../../utils/topScores";
import { useCompetitionContext } from "../../../../context/competition";
import useWebappWorkout from "../../../../hooks/useWebappWorkout";

interface Props {
    activeWorkouts: Workout[];
    stations: Array<DisplayFullStation>;
    CCResults: CCSimpleResult[];
    results: WodResult[];
    categories: string[];
    workouts: Workout[];
}

const DefaultLayout = ({
    activeWorkouts,
    stations,
    CCResults,
    results,
    categories,
    workouts,
}: Props) => {
    const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });
    const { totalRepetitions } = useWebappWorkout(activeWorkouts[0], 0);
    const colNumber = activeWorkouts[0]?.options?.columnDisplayNumber || 1;
    const rowNumber = Math.ceil(stations.length / colNumber);

    const [splitStations, setSplitStations] = useState<DisplayFullStation[][]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        const copiedStations = [...stations];
        switch (activeWorkouts[0]?.options?.rankBy) {
            case "laneNumber":
                sortedStations = copiedStations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = (
                    results.find(
                        (wod) => wod.workoutId === activeWorkouts[0].workoutId
                    ) || results[0]
                ).results
                    .map((result) =>
                        copiedStations.find(
                            (station) =>
                                station.externalId === result.participantId
                        )
                    )
                    .filter(
                        (station) => station !== undefined
                    ) as DisplayFullStation[];

            // sortedStations = copiedStations
            //     .sort((a, b) => a.laneNumber - b.laneNumber)
            //     .sort((a, b) => {
            //         return a.scores?.endTimer.at(-1)?.time ===
            //             b.scores?.endTimer.at(-1)?.time
            //             ? getTotalClassicReps(b, workout.workoutId) -
            //                   getTotalClassicReps(a, workout.workoutId)
            //             : (a.scores?.endTimer.at(-1)?.time || "999999") <
            //               (b.scores?.endTimer.at(-1)?.time || "999999")
            //             ? -1
            //             : 1;
            //     });
            // break;
        }
        setSplitStations(
            sortedStations.reduce<DisplayFullStation[][]>(
                (resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / rowNumber);

                    if (!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }
                    resultArray[chunkIndex].push(item);

                    return resultArray;
                },
                []
            )
        );
    }, [stations, activeWorkouts[0], results]);

    const topScore = results
        .find((r) => r.workoutId === activeWorkouts[0].workoutId)
        ?.results?.find((r) => r.rank === 1);

    const repsOfFirst = topScore?.finished
        ? totalRepetitions
        : (topScore?.finalScore as number);

    // const repsOfFirst = stations
    //     .map((station) =>
    //         getTotalClassicReps(station, activeWorkouts[0]?.workoutId)
    //     )
    //     .sort((a, b) => b - a)[0];
    return (
        <Box display={"flex"} height={1} gap={1} flexDirection={"column"}>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                height={1}
                gap={4}
                px={3}
            >
                {categories.length === 1
                    ? splitStations.map((stations, colIndex) => (
                          <Box
                              key={colIndex}
                              width={1}
                              display={"flex"}
                              flexDirection={"column"}
                              gap={1}
                              ref={parent}
                          >
                              {stations.map((station) => (
                                  <DefaultAthletes
                                      key={station.laneNumber}
                                      station={station}
                                      height={1 / rowNumber}
                                      workout={activeWorkouts[0]}
                                      repsOfFirst={repsOfFirst}
                                      results={results.map((result) => ({
                                          workoutId: result.workoutId,
                                          result: result.results.find(
                                              (res) =>
                                                  res.participantId ===
                                                  station.externalId
                                          ),
                                      }))}
                                      // allTotalReps={allScores}
                                      wodState={globals?.state}
                                  />
                              ))}
                          </Box>
                      ))
                    : categories.map((category) => {
                          const stations = splitStations
                              .flat()
                              .filter(
                                  (station) => station.category === category
                              );

                          // const scores = stations.map(
                          //     (station) =>
                          //         station.scores?.endTimer.at(-1)?.time ||
                          //         getTotalClassicReps(station)
                          // );
                          //
                          // scores.sort((a, b) => {
                          //     if (
                          //         typeof a === "number" &&
                          //         typeof b === "number"
                          //     ) {
                          //         return b - a;
                          //     }
                          //     if (
                          //         typeof a === "string" &&
                          //         typeof b === "string"
                          //     )
                          //         return a < b ? -1 : 1;
                          //
                          //     if (typeof a === "string") return -1;
                          //     return 1;
                          // });

                          const workout =
                              activeWorkouts.find((workout) =>
                                  workout.categories?.includes(category)
                              ) || workouts[1];

                          const repsOfFirst = stations
                              .map((station) =>
                                  getTotalClassicReps(
                                      station,
                                      workout.workoutId
                                  )
                              )
                              .sort((a, b) => b - a)[0];

                          return (
                              <Box
                                  key={category}
                                  width={1}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  gap={1}
                                  ref={parent}
                              >
                                  {stations.map((station) => (
                                      <DefaultAthletes
                                          key={station.laneNumber}
                                          station={station}
                                          height={1 / stations.length}
                                          workout={workout}
                                          repsOfFirst={repsOfFirst}
                                          results={results.map((result) => ({
                                              workoutId: result.workoutId,
                                              result: result.results.find(
                                                  (res) =>
                                                      res.participantId ===
                                                      station.externalId
                                              ),
                                          }))}
                                          // allTotalReps={allScores}
                                          wodState={globals?.state}
                                      />
                                  ))}
                                  <Typography
                                      fontFamily={"BebasNeue"}
                                      fontSize={"4rem"}
                                      color={"white"}
                                      textAlign={"center"}
                                      lineHeight={0.8}
                                  >
                                      {category}
                                  </Typography>
                              </Box>
                          );
                      })}
            </Box>
            <Box
                display={"flex"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
            >
                {categories.map((category) =>
                    getTopScore(1, category, CCResults).map((score) => (
                        <Box
                            key={score.participantId}
                            display={"flex"}
                            gap={2}
                            alignItems={"baseline"}
                        >
                            <Typography
                                fontFamily={"bebasNeue"}
                                color={"white"}
                                fontSize={"2rem"}
                            >
                                Current top score:
                            </Typography>
                            <Typography
                                fontFamily={
                                    competition?.customFont || "bebasNeue"
                                }
                                color={competition?.primaryColor}
                                fontSize={"3rem"}
                            >
                                {score.scores[0]}
                            </Typography>
                            <Typography
                                fontFamily={
                                    competition?.customFont || "bebasNeue"
                                }
                                color={competition?.secondaryColor}
                                fontSize={"3rem"}
                            >
                                ( {score.participant} )
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default DefaultLayout;
