import { useLiveDataContext } from "../../context/liveData/livedata";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { getTotalClassicReps } from "../../utils/scoring";
import { Box } from "@mui/system";
import DefaultAthletes from "./DefaultAthletes";
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
    const { globals } = useLiveDataContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });

    const [sortedStations, setSortedStations] = useState<DisplayFullStation[]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        const copiedStations = [...stations];
        switch (workouts.at(-1)?.options?.rankBy) {
            case "laneNumber":
                sortedStations = copiedStations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = stations
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
        <>
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
                    <Box width={1}>
                        <Box
                            display={"flex"}
                            justifyContent={"flex-start"}
                            gap={2}
                            ref={parent}
                        >
                            {stations.slice(0, 3).map((station) => (
                                <DefaultAthletes
                                    key={station.laneNumber}
                                    station={station}
                                    workout={workout}
                                    repsOfFirst={repsOfFirst}
                                    allTotalReps={scores}
                                    wodState={globals?.state}
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

export default DefaultMultiCategoriesLayout;
