import { useLiveDataContext } from "../../context/liveData/livedata";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { splitMTscore } from "../../utils/splitMTscore";
import SplitMTAthletes from "./SplitMTAthletes";
import { Typography } from "@mui/material";

interface Props {
    workouts: Workout[];
    stations: Array<DisplayFullStation>;
    timer: number;
    categories: string[];
}

const SplitMTMultiCategoriesLayout = ({
    workouts,
    stations,
    timer,
    categories,
}: Props) => {
    const { globals } = useLiveDataContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });
    const [sortedStations, setSortedStations] = useState<DisplayFullStation[]>(
        []
    );

    const currentRound = Math.floor(timer / (1000 * 60 * 3));
    const isRest =
        timer % (1000 * 60 * 3) === 0 ||
        timer % (1000 * 60 * 3) >= 1000 * 60 * 2;

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        switch (workouts.at(-1)?.options?.rankBy) {
            case "laneNumber":
                sortedStations = stations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = stations
                    .sort((a, b) => a.laneNumber - b.laneNumber)
                    .sort((a, b) => {
                        return a.scores?.endTimer.at(-1)?.time ===
                            b.scores?.endTimer.at(-1)?.time
                            ? splitMTscore(
                                  b.scores?.wodSplit || [],
                                  workouts.find((workout) =>
                                      workout.categories?.includes(b.category)
                                  ) || workouts[0]
                              ) -
                                  splitMTscore(
                                      a.scores?.wodSplit || [],
                                      workouts.find((workout) =>
                                          workout.categories?.includes(
                                              a.category
                                          )
                                      ) || workouts[0]
                                  )
                            : (a.scores?.endTimer.at(-1)?.time || "999999") <
                              (b.scores?.endTimer.at(-1)?.time || "999999")
                            ? -1
                            : 1;
                    });
                break;
        }
        setSortedStations(sortedStations);
    }, [stations, workouts]);

    return (
        <>
            {categories.map((category) => {
                const stations = sortedStations.filter(
                    (station) => station.category === category
                );

                const scores = stations.map(
                    (station) =>
                        station.scores?.endTimer.at(-1)?.time ||
                        splitMTscore(
                            station.scores?.wodSplit || [],
                            workouts.find((workout) =>
                                workout.categories?.includes(station.category)
                            ) || workouts[0]
                        )
                );

                scores.sort((a, b) => {
                    if (typeof a === "number" && typeof b === "number") {
                        return b - a;
                    }
                    if (typeof a === "string" && typeof b === "string")
                        return a < b ? -1 : 1;

                    if (typeof a === "string") return -1;
                    return 1;
                });

                const repsOfFirst = scores.filter(
                    (score): score is number => typeof score === "number"
                )[0];

                const workout =
                    workouts.find((workout) =>
                        workout.categories?.includes(category)
                    ) || workouts[0];

                return (
                    <Box width={1}>
                        <Box
                            display={"flex"}
                            justifyContent={"flex-start"}
                            gap={2}
                            ref={parent}
                        >
                            {stations.slice(0, 3).map((station) => (
                                <SplitMTAthletes
                                    key={station.laneNumber}
                                    station={station}
                                    workout={workout}
                                    repsOfFirst={repsOfFirst}
                                    allTotalReps={scores}
                                    wodState={globals?.state}
                                    rest={isRest}
                                    round={currentRound}
                                />
                            ))}
                        </Box>
                        <Typography
                            height={25}
                            width={1}
                            color={"white"}
                            fontFamily={"bebasNeue"}
                            sx={{ backgroundColor: "#312F2F" }}
                            fontSize={"1.2rem"}
                            textAlign={"center"}
                            px={2}
                        >
                            {category}
                        </Typography>
                    </Box>
                );
            })}
        </>
    );
};

export default SplitMTMultiCategoriesLayout;
