import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { splitMTscore } from "../../../../utils/splitMTscore";
import SplitMTAthlete2 from "./SplitMTAthlete2";
import SplitAthlete from "./SplitAthlete";
import { getTopScore } from "../../../../utils/topScores";
import { Typography } from "@mui/material";
import { useCompetitionContext } from "../../../../context/competition";

interface Props {
    workout: Workout;
    stations: Array<DisplayFullStation>;
    timer: number;
    results: CCSimpleResult[];
}

const SplitLayout = ({ workout, stations, timer, results }: Props) => {
    const competition = useCompetitionContext();
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
                        const scoreA =
                            a?.scores?.wodSplit
                                .filter(
                                    (rep) => rep.index === workout.workoutId
                                )
                                .reduce(
                                    (total, score) => total + +score.rep,
                                    0
                                ) || 0;
                        const scoreB =
                            b?.scores?.wodSplit
                                .filter(
                                    (rep) => rep.index === workout.workoutId
                                )
                                .reduce(
                                    (total, score) => total + +score.rep,
                                    0
                                ) || 0;

                        return a.scores?.endTimer.at(-1)?.time ===
                            b.scores?.endTimer.at(-1)?.time
                            ? scoreB - scoreA
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
                station.scores?.wodSplit
                    .filter((rep) => rep.index === workout.workoutId)
                    .reduce((total, score) => total + +score.rep, 0) ||
                0
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
        <Box display={"flex"} height={1} gap={1} flexDirection={"column"}>
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
                            <SplitAthlete
                                key={station.laneNumber}
                                station={station}
                                height={1 / rowNumber}
                                workout={workout}
                                allTotalReps={allScores}
                                round={currentRound}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                {getTopScore(1, stations[0].category, results).map((score) => (
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
                            fontFamily={competition?.customFont || "bebasNeue"}
                            color={competition?.primaryColor}
                            fontSize={"3rem"}
                        >
                            {score.scores[0]}
                        </Typography>
                        <Typography
                            fontFamily={competition?.customFont || "bebasNeue"}
                            color={competition?.secondaryColor}
                            fontSize={"3rem"}
                        >
                            ( {score.participant} )
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SplitLayout;
