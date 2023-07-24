import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import DefaultAthletes from "./DefaultAthletes";
import { getTotalClassicReps } from "../../../../utils/scoring";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Typography } from "@mui/material";

interface Props {
    workouts: Workout[];
    stations: Array<DisplayFullStation>;
    categories: string[];
}

const DefaultMultiCategoriesLayout = ({
    workouts,
    stations,
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
                        return a.scores?.endTimer[workouts.length - 1]?.time ===
                            b.scores?.endTimer[workouts.length - 1]?.time
                            ? getTotalClassicReps(b) - getTotalClassicReps(a)
                            : (a.scores?.endTimer[workouts.length - 1]?.time ||
                                  "999999") <
                              (b.scores?.endTimer[workouts.length - 1]?.time ||
                                  "999999")
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
                        station.scores?.endTimer[workouts.length - 1]?.time ||
                        getTotalClassicReps(station)
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
                            <DefaultAthletes
                                key={station.laneNumber}
                                station={station}
                                height={1 / stations.length}
                                workout={workout}
                                repsOfFirst={repsOfFirst}
                                allTotalReps={scores}
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

export default DefaultMultiCategoriesLayout;
