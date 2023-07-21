import { useLiveDataContext } from "../../context/liveData/livedata";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import { splitMTscore } from "../../utils/splitMTscore";
import SplitMTAthletes from "./SplitMTAthletes";

interface Props {
    workout: Workout;
    stations: Array<DisplayFullStation>;
    timer: number;
}

const DefaultLayout = ({ workout, stations, timer }: Props) => {
    const { globals } = useLiveDataContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });

    const currentRound = Math.floor(timer / (1000 * 60 * 3));
    const isRest =
        timer % (1000 * 60 * 3) === 0 ||
        timer % (1000 * 60 * 3) >= 1000 * 60 * 2;

    const [splitStations, setSplitStations] = useState<DisplayFullStation[]>(
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
        setSplitStations(sortedStations);
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
            justifyContent={"flex-start"}
            width={1}
            gap={2}
            ref={parent}
        >
            {splitStations.slice(0, 6).map((station) => (
                <SplitMTAthletes
                    key={station.laneNumber}
                    station={station}
                    workout={workout}
                    repsOfFirst={repsOfFirst}
                    allTotalReps={allScores}
                    wodState={globals?.state}
                    round={currentRound}
                    rest={isRest}
                />
            ))}
        </Box>
    );
};

export default DefaultLayout;
