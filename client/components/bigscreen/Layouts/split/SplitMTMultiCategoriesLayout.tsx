import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { splitMTscore } from "../../../../utils/splitMTscore";
import { Typography } from "@mui/material";
import SplitMTAthlete2 from "./SplitMTAthlete2";

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
        const copiedStations = [...stations];
        let sortedStations: DisplayFullStation[] = [];
        switch (workouts.at(-1)?.options?.rankBy) {
            case "laneNumber":
                sortedStations = copiedStations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = copiedStations
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
        <Box
            display={"flex"}
            justifyContent={"space-between"}
            height={1}
            gap={1}
        >
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
                    <Box
                        key={category}
                        width={1}
                        display={"flex"}
                        flexDirection={"column"}
                        gap={1}
                        ref={parent}
                    >
                        {stations.map((station) => (
                            <SplitMTAthlete2
                                key={station.laneNumber}
                                station={station}
                                height={1 / stations.length}
                                workout={workout}
                                repsOfFirst={repsOfFirst}
                                allTotalReps={scores}
                                round={currentRound}
                                rest={isRest}
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
    );
};

export default SplitMTMultiCategoriesLayout;
