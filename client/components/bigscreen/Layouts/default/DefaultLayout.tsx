import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import DefaultAthletes from "./DefaultAthletes";
import { getTotalClassicReps } from "../../../../utils/scoring";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";

interface Props {
    workout: Workout;
    stations: Array<DisplayFullStation>;
}

const DefaultLayout = ({ workout, stations }: Props) => {
    const { globals } = useLiveDataContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });
    const colNumber = workout.options?.columnDisplayNumber || 1;
    const rowNumber = Math.ceil(stations.length / colNumber);

    const [splitStations, setSplitStations] = useState<DisplayFullStation[][]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        const copiedStations = [...stations];
        switch (workout.options?.rankBy) {
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
                            ? getTotalClassicReps(b) - getTotalClassicReps(a)
                            : (a.scores?.endTimer.at(-1)?.time || "999999") <
                              (b.scores?.endTimer.at(-1)?.time || "999999")
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
        const scores = stations.map(
            (station) =>
                station.scores?.endTimer.at(-1)?.time ||
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

    useEffect(() => {
        console.log(repsOfFirst);
    }, [repsOfFirst]);

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
                    {stations.map((station) => (
                        <DefaultAthletes
                            key={station.laneNumber}
                            station={station}
                            height={1 / rowNumber}
                            workout={workout}
                            repsOfFirst={repsOfFirst}
                            allTotalReps={allScores}
                            wodState={globals?.state}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default DefaultLayout;
