import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import Chrono from "../components/bigscreen/Chrono";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toReadableTime } from "../components/bigscreen/WodRunningAthlete";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";

const SpeakerLight = () => {
    const [parent] = useAutoAnimate({ duration: 500, easing: "ease-in-out" });
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
    const CCData = useCompetitionCornerContext();
    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );

    const { timer } = useChrono(globals?.startTime, globals?.duration);

    const currentIndex = useMemo(
        () =>
            workout?.wodIndexSwitchMinute === 0
                ? 0
                : Number(timer?.toString().replaceAll(":", "")) <
                  (workout?.wodIndexSwitchMinute || 0) * 100000
                ? 0
                : 1,
        [timer, workout?.wodIndexSwitchMinute]
    );
    // const totalReps = useMemo(
    //     () =>
    //         loadedWorkouts?.[0]?.blocks[currentIndex]?.measurements?.repsTot ||
    //         0,
    //     [currentIndex, loadedWorkouts]
    // );

    // const workoutType = useMemo(
    //     () => loadedWorkouts?.[0]?.scoring[currentIndex]?.method || "forTime",
    //     [currentIndex, loadedWorkouts]
    // );

    const stationsReady = useStationReady(
        workout?.dataSource,
        workout?.options?.rankBy,
        currentIndex
    );

    // const repsOfFirst = useMemo(
    //     () =>
    //         stationsReady
    //             ?.map((station) => station.repsPerBlock?.[currentIndex])
    //             .sort((a, b) => b - a)[0],
    //     [stationsReady, currentIndex]
    // );

    // const workoutFlow = useMemo(
    //     () =>
    //         workouts.find(
    //             (workout) =>
    //                 workout.workoutIds.includes(
    //                     globals?.externalWorkoutId.toString() || ""
    //                 ) && workout.index === currentIndex
    //         ),
    //     [workout, globals, currentIndex]
    // );

    // const mvtsOfFirst = useMemo(
    //     () =>
    //         stationsReady
    //             ?.map((station) => station.repsPerBlock?.[currentIndex])
    //             .sort((a, b) => b - a)[0],
    //     []
    // );

    // const workoutDescription = useMemo(() => {
    //     if (!workoutFlow?.main.movements) return;
    //     const movements: string[] = [];
    //     for (let i = 0; i < workoutFlow.main.movements.length; i++) {
    //         movements.push(
    //             `${workoutFlow.main.reps[i]} ${workoutFlow.main.movements[i]}`
    //         );
    //     }
    //     return movements.join(" - ");
    // }, [workoutFlow]);

    // const { movement, movementTotalReps } = useWorkout(
    //     workoutFlow,
    //     repsOfFirst || 0
    // );

    const currentCCHeat = CCData.heats.find(
        (heat) => heat.id === globals?.externalHeatId
    );

    return (
        <Box sx={{ backgroundColor: "#58585e" }} height={1} minHeight={"100vh"}>
            <Box
                display={"flex"}
                color={"#f1f1f1"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={2}
                px={2}
                py={2}
            >
                <Typography
                    component={"h4"}
                    variant={"h4"}
                    fontSize={"1.5rem"}
                    alignItems={"center"}
                >
                    {currentCCHeat?.divisions} - {currentCCHeat?.title}
                </Typography>
                <Chrono
                    reverse={workout?.options?.chronoDirection === "desc"}
                    fontSize={"1.5rem"}
                />
            </Box>

            <Stack
                gap={2}
                ref={parent}
                my={2}
                sx={{ backgroundColor: "#d3d3d3" }}
                p={2}
            >
                <Typography
                    textAlign={"center"}
                    fontFamily={"BebasNeue"}
                    fontSize={"1.5rem"}
                >
                    Top Score
                </Typography>
                {CCData.results
                    .filter(
                        (result) =>
                            result.division === currentCCHeat?.divisions[0]
                    )
                    ?.sort((a, b) => {
                        const scoreA = a?.scores[0] || "0";
                        const scoreB = b?.scores[0] || "0";

                        if (scoreA.includes("WD") || scoreA === "0") return 1;
                        if (scoreB.includes("WD") || scoreB === "0") return -1;
                        if (scoreA.includes("Cap+") && scoreB.includes("Cap+"))
                            return (
                                +scoreB.replaceAll("Cap+ ", "") -
                                +scoreA.replaceAll("Cap+", "")
                            );

                        if (scoreA.includes("Cap+") && !scoreB.includes("Cap+"))
                            return 1;
                        if (!scoreA.includes("Cap+") && scoreB.includes("Cap+"))
                            return -1;

                        return (
                            +scoreA.replace(":", "") - +scoreB.replace(":", "")
                        );
                    })
                    .slice(0, 3)
                    .map((result, index) => (
                        <Box
                            key={result.participantId}
                            sx={{ fontFamily: "BebasNeue" }}
                        >
                            {result.scores[0] && (
                                <Box display={"flex"} gap={2}>
                                    <Typography fontFamily={"BebasNeue"}>
                                        {index + 1}
                                    </Typography>
                                    <Typography fontFamily={"BebasNeue"}>
                                        {result.participant}
                                    </Typography>
                                    <Typography
                                        fontFamily={"BebasNeue"}
                                        ml={"auto"}
                                    >
                                        {result.scores[0]}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
            </Stack>
            <Stack gap={2} ref={parent} px={2}>
                {stationsReady?.slice(0, 5).map((station) => {
                    const finishResult =
                        station.result?.replace("|", " | ") ||
                        (!station.measurements?.[currentIndex]
                            ? undefined
                            : station.measurements[currentIndex].method ===
                              "time"
                            ? toReadableTime(
                                  station.measurements[currentIndex].value
                              )
                            : `${station.measurements[
                                  currentIndex
                              ].value?.toString()} reps|`);

                    const repsCompleted =
                        station.repsPerBlock?.[currentIndex] || 0;

                    const rank =
                        [
                            ...new Set(
                                stationsReady
                                    .filter(
                                        (sR) => sR.category === station.category
                                    )
                                    .map(
                                        (stationFiltered) =>
                                            stationFiltered.rank[currentIndex]
                                    )
                            ),
                        ]
                            .sort((a, b) => a - b)
                            .findIndex(
                                (rank) => rank === station.rank[currentIndex]
                            ) + 1;

                    return (
                        <Box
                            key={station.laneNumber}
                            p={2}
                            sx={{
                                backgroundColor: "#d3d3d3",
                                color: "black",
                                transition: "1.5s ease",
                            }}
                            position={"relative"}
                            boxShadow={"4px 4px 9px "}
                            borderRadius={1}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            gap={1}
                            fontFamily={"BebasNeue"}
                        >
                            <Typography
                                fontFamily={"BebasNeue"}
                                fontSize={"1rem"}
                            >
                                {station.laneNumber} - {station.participant}
                            </Typography>
                            <Typography fontFamily={"BebasNeue"}>
                                {finishResult
                                    ? finishResult.slice(
                                          0,
                                          finishResult.length - 1
                                      )
                                    : repsCompleted}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default SpeakerLight;
