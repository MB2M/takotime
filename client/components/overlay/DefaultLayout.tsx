import { useLiveDataContext } from "../../context/liveData/livedata";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useMemo, useState } from "react";
import { getTotalClassicReps } from "../../utils/scoring";
import { Box } from "@mui/system";
import DefaultAthletes from "./DefaultAthletes";

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

    const [splitStations, setSplitStations] = useState<DisplayFullStation[]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        switch (workout?.options?.rankBy) {
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
                            ? getTotalClassicReps(b) - getTotalClassicReps(a)
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
            justifyContent={"flex-start"}
            width={1}
            gap={2}
            ref={parent}
        >
            {splitStations.slice(0, 6).map((station) => (
                <DefaultAthletes
                    key={station.laneNumber}
                    station={station}
                    workout={workout}
                    repsOfFirst={repsOfFirst}
                    allTotalReps={allScores}
                    wodState={globals?.state}
                />
            ))}
        </Box>
    );
};

export default DefaultLayout;
