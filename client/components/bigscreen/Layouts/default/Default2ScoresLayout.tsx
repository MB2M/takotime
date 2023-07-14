import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import DefaultAthletes from "./DefaultAthletes";
import { getTotalClassicReps } from "../../../../utils/scoring";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
    workouts: Workout[];
    stations: Array<DisplayFullStation>;
}

const Default2ScoresLayout = ({ workouts, stations }: Props) => {
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });

    const workout = workouts.at(-1)!;

    const colNumber = workout.options?.columnDisplayNumber || 1;
    const rowNumber = Math.ceil(stations.length / colNumber);

    const [splitStations, setSplitStations] = useState<DisplayFullStation[][]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        switch (workout.options?.rankBy) {
            case "laneNumber":
                sortedStations = stations.sort(
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
    }, [stations, workout]);

    const allScores = useMemo(() => {
        console.log(stations);
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
        return scores;
    }, [splitStations]);

    const repsOfFirst = allScores.filter(
        (score): score is number => typeof score === "number"
    )[0];

    return (
        <Box
            display={"flex"}
            justifyContent={"space-between"}
            height={1}
            gap={1}
        >
            {splitStations.map((stations, colIndex) => (
                <Box
                    key={colIndex}
                    width={1}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={1}
                    ref={parent}
                >
                    {stations.map((station, index) => (
                        <DefaultAthletes
                            key={station.laneNumber}
                            station={station}
                            height={1 / rowNumber}
                            workout={workout}
                            repsOfFirst={repsOfFirst}
                            allTotalReps={allScores}
                            firstScore={station.scores?.endTimer[0]?.time}
                            participantTextRows={1}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default Default2ScoresLayout;
