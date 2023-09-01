import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import MaxWeightAthletes from "./MaxWeightAthletes";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Typography } from "@mui/material";
import { getTopScore } from "../../../../utils/topScores";
import { useCompetitionContext } from "../../../../context/competition";

interface Props {
    activeWorkouts: Workout[];
    stations: Array<DisplayFullStation>;
    CCResults: CCSimpleResult[];
    results: WodResult[];
    categories: string[];
    workouts: Workout[];
}

const MaxWeightLayout = ({
    activeWorkouts,
    stations,
    CCResults,
    results,
    categories,
    workouts,
}: Props) => {
    const competition = useCompetitionContext();
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
        disrespectUserMotionPreference: true,
    });
    const colNumber = activeWorkouts[0]?.options?.columnDisplayNumber || 1;
    const rowNumber = Math.ceil(stations.length / colNumber);

    const [splitStations, setSplitStations] = useState<DisplayFullStation[][]>(
        []
    );

    useEffect(() => {
        let sortedStations: DisplayFullStation[] = [];
        const copiedStations = [...stations];
        switch (activeWorkouts[0]?.options?.rankBy) {
            case "laneNumber":
                sortedStations = copiedStations.sort(
                    (a, b) => a.laneNumber - b.laneNumber
                );
                break;
            case "repsCount":
                sortedStations = (
                    results.find(
                        (wod) => wod.workoutId === activeWorkouts[0].workoutId
                    ) || results[0]
                ).results
                    .map((result) =>
                        copiedStations.find(
                            (station) =>
                                station.externalId === result.participantId
                        )
                    )
                    .filter(
                        (station) => station !== undefined
                    ) as DisplayFullStation[];

            // sortedStations = copiedStations
            //     .sort((a, b) => a.laneNumber - b.laneNumber)
            //     .sort((a, b) => {
            //         return a.scores?.endTimer.at(-1)?.time ===
            //             b.scores?.endTimer.at(-1)?.time
            //             ? getTotalClassicReps(b, workout.workoutId) -
            //                   getTotalClassicReps(a, workout.workoutId)
            //             : (a.scores?.endTimer.at(-1)?.time || "999999") <
            //               (b.scores?.endTimer.at(-1)?.time || "999999")
            //             ? -1
            //             : 1;
            //     });
            // break;
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
    }, [stations, activeWorkouts[0], results]);

    return (
        <Box display={"flex"} height={1} gap={1} flexDirection={"column"}>
            <Box
                width={1}
                display={"flex"}
                px={3}
                color={"white"}
                lineHeight={"2rem"}
                fontSize={"2rem"}
                fontFamily={competition?.customFont}
            >
                <Typography
                    fontFamily={"inherit"}
                    width={0.04}
                    textAlign={"center"}
                    fontSize={"inherit"}
                >
                    Rank
                </Typography>
                <Typography
                    fontFamily={"inherit"}
                    width={0.47 / 2}
                    textAlign={"center"}
                    fontSize={"inherit"}
                >
                    Participant
                </Typography>
                <Box flexGrow={1} display={"flex"}>
                    <Typography
                        fontFamily={"inherit"}
                        width={1 / 5}
                        textAlign={"center"}
                        fontSize={"inherit"}
                    >
                        P1 try
                    </Typography>
                    <Typography
                        fontFamily={"inherit"}
                        width={1 / 5}
                        textAlign={"center"}
                        fontSize={"inherit"}
                    >
                        P1 Best
                    </Typography>
                    <Typography
                        fontFamily={"inherit"}
                        width={1 / 5}
                        textAlign={"center"}
                        fontSize={"inherit"}
                    >
                        P2 try
                    </Typography>
                    <Typography
                        fontFamily={"inherit"}
                        width={1 / 5}
                        textAlign={"center"}
                        fontSize={"inherit"}
                    >
                        P2 Best
                    </Typography>
                    <Typography
                        fontFamily={"inherit"}
                        width={1 / 5}
                        textAlign={"center"}
                        fontSize={"inherit"}
                    >
                        Total
                    </Typography>
                </Box>
            </Box>
            {/*<Box*/}
            {/*    display={"flex"}*/}
            {/*    justifyContent={"space-between"}*/}
            {/*    height={1}*/}
            {/*    gap={4}*/}
            {/*    px={3}*/}
            {/*>*/}
            <>
                {categories.length === 1 ? (
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        height={1}
                        gap={4}
                        px={3}
                    >
                        {" "}
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
                                    <MaxWeightAthletes
                                        workout={activeWorkouts[0]}
                                        key={station.laneNumber}
                                        station={station}
                                        height={1 / (rowNumber + 1)}
                                        results={results.map((result) => ({
                                            workoutId: result.workoutId,
                                            result: result.results.find(
                                                (res) =>
                                                    res.participantId ===
                                                    station.externalId
                                            ),
                                        }))}
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    categories.map((category) => {
                        const stations = splitStations
                            .flat()
                            .filter((station) => station.category === category);

                        const workout =
                            activeWorkouts.find((workout) =>
                                workout.categories?.includes(category)
                            ) || workouts[1];

                        return (
                            <Box
                                key={category}
                                width={1}
                                display={"flex"}
                                flexDirection={"column"}
                                gap={1}
                                ref={parent}
                                height={1}
                            >
                                {stations.map((station) => (
                                    <MaxWeightAthletes
                                        key={station.laneNumber}
                                        station={station}
                                        height={1 / stations.length}
                                        workout={workout}
                                        results={results.map((result) => ({
                                            workoutId: result.workoutId,
                                            result: result.results.find(
                                                (res) =>
                                                    res.participantId ===
                                                    station.externalId
                                            ),
                                        }))}
                                    />
                                ))}
                                <Typography
                                    fontFamily={"BebasNeue"}
                                    fontSize={"3rem"}
                                    color={"white"}
                                    textAlign={"center"}
                                    lineHeight={0.8}
                                >
                                    {category}
                                </Typography>
                            </Box>
                        );
                    })
                )}
            </>

            <Box
                display={"flex"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
            >
                {categories.map((category) =>
                    getTopScore(1, category, CCResults).map((score) => (
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
                                fontFamily={
                                    competition?.customFont || "bebasNeue"
                                }
                                color={competition?.primaryColor}
                                fontSize={"3rem"}
                            >
                                {score.scores[0]}
                            </Typography>
                            <Typography
                                fontFamily={
                                    competition?.customFont || "bebasNeue"
                                }
                                color={competition?.secondaryColor}
                                fontSize={"3rem"}
                            >
                                ( {score.participant} )
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default MaxWeightLayout;
