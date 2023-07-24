import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { splitMTscore } from "../../../../utils/splitMTscore";
import SplitMTAthlete2 from "./SplitMTAthlete2";

interface Props {
    workout: Workout;
    stations: Array<DisplayFullStation>;
    timer: number;
}

const SplitMTLayout = ({ workout, stations, timer }: Props) => {
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

    const currentRound = Math.floor(timer / (1000 * 60 * 3));
    const isRest =
        timer % (1000 * 60 * 3) === 0 ||
        timer % (1000 * 60 * 3) >= 1000 * 60 * 2;

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
                            ? splitMTscore(b.scores?.wodSplit || [], workout) -
                                  splitMTscore(
                                      a.scores?.wodSplit || [],
                                      workout
                                  )
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
                splitMTscore(station.scores?.wodSplit || [], workout)
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
                    {stations.map((station) => (
                        <SplitMTAthlete2
                            key={station.laneNumber}
                            station={station}
                            height={1 / rowNumber}
                            workout={workout}
                            repsOfFirst={repsOfFirst}
                            allTotalReps={allScores}
                            round={currentRound}
                            rest={isRest}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default SplitMTLayout;
