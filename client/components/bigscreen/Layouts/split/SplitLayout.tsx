import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SplitAthlete from "./SplitAthlete";
import { getTopScore } from "../../../../utils/topScores";
import { Typography } from "@mui/material";
import { useCompetitionContext } from "../../../../context/competition";

interface Props {
    activeWorkouts: Workout[];
    stations: Array<DisplayFullStation>;
    timer: number;
    CCResults: CCSimpleResult[];
    results: WodResult[];
    categories: string[];
    workouts: Workout[];
}

const SplitLayout = ({
    activeWorkouts,
    stations,
    timer,
    CCResults,
    results,
    categories,
    workouts,
}: Props) => {
    const competition = useCompetitionContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });
    const colNumber = activeWorkouts[0]?.options?.columnDisplayNumber || 1;
    const rowNumber = Math.ceil(stations.length / colNumber);

    const [splitStations, setSplitStations] = useState<DisplayFullStation[][]>(
        []
    );

    const currentRound = Math.floor(timer / (1000 * 60 * 3));

    useEffect(() => {
        if (!results || !activeWorkouts) return;
        let sortedStations: DisplayFullStation[] = [];
        const copiedStations = [...stations];

        switch (activeWorkouts?.[0]?.options?.rankBy) {
            case "laneNumber":
                sortedStations = copiedStations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = (results
                    .find(
                        (wod) => wod.workoutId === activeWorkouts[0]?.workoutId
                    )
                    ?.results.map((result) =>
                        copiedStations.find(
                            (station) =>
                                station.externalId === result.participantId
                        )
                    )
                    .filter((station) => station !== undefined) ||
                    copiedStations) as DisplayFullStation[];
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
    }, [stations, activeWorkouts, results]);

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
                                  <SplitAthlete
                                      key={station.laneNumber}
                                      station={station}
                                      height={1 / rowNumber}
                                      workout={activeWorkouts[0]}
                                      results={results.map((result) => ({
                                          workoutId: result.workoutId,
                                          result: result.results.find(
                                              (res) =>
                                                  res.participantId ===
                                                  station.externalId
                                          ),
                                      }))}
                                      round={currentRound}
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

                          const workout =
                              activeWorkouts.find((workout) =>
                                  workout.categories?.includes(category)
                              ) || workouts[1];

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
                                      <SplitAthlete
                                          key={station.laneNumber}
                                          station={station}
                                          height={1 / rowNumber}
                                          workout={workout}
                                          results={results.map((result) => ({
                                              workoutId: result.workoutId,
                                              result: result.results.find(
                                                  (res) =>
                                                      res.participantId ===
                                                      station.externalId
                                              ),
                                          }))}
                                          round={currentRound}
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

export default SplitLayout;
