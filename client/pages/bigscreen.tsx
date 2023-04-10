import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import MaxTonnage from "../components/bigscreen/MaxTonnage";
import WodRunningAthlete from "../components/bigscreen/WodRunningAthlete";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import { workouts } from "../eventConfig/cannesBirthday/config";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import { useRouter } from "next/router";

const HEADER_HEIGHT = 150;

const BigScreen = () => {
    const { globals, stations, loadedWorkouts } = useLiveDataContext();
    const competition = useCompetitionContext();
    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );

    // const [stationsInfo, setStationsInfo] = useState<BaseStation[]>([]);
    const { timer } = useChrono(globals?.startTime, globals?.duration);
    // const stationsUpgraded = useStationPayload(stations, ranks);

    const router = useRouter();
    const title = router.query.title as string | undefined;

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
    const totalReps = useMemo(
        () =>
            loadedWorkouts?.[0]?.blocks[currentIndex]?.measurements?.repsTot ||
            0,
        [currentIndex, loadedWorkouts]
    );

    const workoutType = useMemo(
        () => loadedWorkouts?.[0]?.scoring[currentIndex]?.method || "forTime",
        [currentIndex, loadedWorkouts]
    );

    // const allScores = useMemo(() => {
    //     return [
    //         stationsInfo
    //             .map(
    //                 (station) =>
    //                     station.scores?.find((score) => score.index === 0)
    //                         ?.repCount || 0
    //             )
    //             .sort((a, b) => (b || 0) - (a || 0)),
    //         stationsInfo
    //             .map(
    //                 (station) =>
    //                     station.scores?.find((score) => score.index === 1)
    //                         ?.repCount || 0
    //             )
    //             .sort((a, b) => (b || 0) - (a || 0)),
    //     ];
    // }, [stationsInfo]);

    // const fullStations = useMemo(
    //     () =>
    //         stations.map((stationUp) => {
    //             return {
    //                 ...stationUp,
    //                 repsPerBlock: [
    //                     stationsInfo
    //                         ?.find(
    //                             (station) =>
    //                                 station.laneNumber === stationUp.laneNumber
    //                         )
    //                         ?.scores?.find((score) => score.index === 0)
    //                         ?.repCount || 0,
    //                     stationsInfo
    //                         ?.find(
    //                             (station) =>
    //                                 station.laneNumber === stationUp.laneNumber
    //                         )
    //                         ?.scores?.find((score) => score.index === 1)
    //                         ?.repCount || 0,
    //                 ],
    //                 rank: allScores.map((scoreIndex, i) =>
    //                     scoreIndex.findIndex((score, index) => {
    //                         return (
    //                             score ===
    //                             stationsInfo
    //                                 ?.find(
    //                                     (station) =>
    //                                         station.laneNumber ===
    //                                         stationUp.laneNumber
    //                                 )
    //                                 ?.scores?.find((score) => score.index === i)
    //                                 ?.repCount
    //                         );
    //                     }) === -1
    //                         ? scoreIndex.length + 1
    //                         : scoreIndex.findIndex((score) => {
    //                               return (
    //                                   score ===
    //                                   stationsInfo
    //                                       ?.find(
    //                                           (station) =>
    //                                               station.laneNumber ===
    //                                               stationUp.laneNumber
    //                                       )
    //                                       ?.scores?.find(
    //                                           (score) => score.index === i
    //                                       )?.repCount
    //                               );
    //                           }) + 1
    //                 ),
    //             };
    //         }),
    //     [stationsInfo, allScores]
    // );
    const stationsReady = useStationReady(
        workout?.dataSource,
        workout?.options?.rankBy,
        currentIndex
    );

    // const stationsUpgradedRankedScores = useMemo(() => {
    //     return stationsUpgraded
    //         .map((station) => station.rank[station.rank.length - 1])
    //         .sort((a, b) => a - b);
    // }, [stationsUpgraded]);

    // const restrieveWodGymInfo = async () => {
    //     if (!globals?.externalHeatId) return;
    //     try {
    //         const response = await fetch(
    //             `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station?heatId=${globals?.externalHeatId}`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         if (response.ok) {
    //             const json = await response.json();
    //             setStationsInfo(json);
    //         } else {
    //             setStationsInfo([]);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         setStationsInfo([]);
    //     }
    // };

    // useInterval(
    //     () => {
    //         restrieveWodGymInfo();
    //     },
    //     workout?.dataSource === "web" ? 1000 : 0
    // );

    return (
        <BigscreenLayout headerHeight={HEADER_HEIGHT} customTitle={title}>
            <Box
                width={5}
                height={1080 - HEADER_HEIGHT}
                sx={{ backgroundColor: "#1f96d6ff" }}
                position="absolute"
                left={520 + (70 / 292) * ((1920 * 3) / 4 - 520)}
                zIndex={10}
            ></Box>
            <Box
                width={5}
                height={1080 - HEADER_HEIGHT}
                sx={{ backgroundColor: "#1f96d6ff" }}
                position="absolute"
                left={520 + (137 / 292) * ((1920 * 3) / 4 - 520)}
                zIndex={10}
            ></Box>
            <Box
                width={5}
                height={1080 - HEADER_HEIGHT}
                sx={{ backgroundColor: "#1f96d6ff" }}
                position="absolute"
                left={520 + (216 / 292) * ((1920 * 3) / 4 - 520)}
                zIndex={10}
            ></Box>
            <Stack overflow={"hidden"} height={1}>
                {workout?.layout === "MaxTonnage" && (
                    <MaxTonnage
                        heatId={globals?.externalHeatId}
                        stations={stations}
                    />
                )}
                {workout?.layout === "default" &&
                    stationsReady?.map((station) => {
                        const repsOfFirst = stationsReady
                            .map(
                                (station) =>
                                    station.repsPerBlock?.[currentIndex]
                            )
                            .sort((a, b) => b - a)[0];
                        const workoutFlow = workouts.find(
                            (workout) =>
                                workout.workoutIds.includes(
                                    globals?.externalWorkoutId.toString() || ""
                                ) && workout.index === currentIndex
                        );
                        return (
                            <WodRunningAthlete
                                key={station.laneNumber} //commun
                                currentIndex={currentIndex}
                                dataSource={workout?.dataSource}
                                station={station as WidescreenStation}
                                options={workout?.options} //commun
                                workout={workoutFlow}
                                // repsCompleted={s.repsPerBlock?.[currentIndex] || 0} // DIFFERENT
                                // participant={s.participant} //commun
                                totalReps={totalReps} // DIFFERENT
                                // currentMovement={s.currentMovement} // DIFFERENT
                                // currentMovementReps={s.repsOfMovement} // DIFFERENT
                                // currentMovementTotalReps={s.totalRepsOfMovement} // DIFFERENT
                                // currentRound={s.position.round + 1} // DIFFERENT
                                workoutType={workoutType as "amrap" | "forTime"} // DIFFERENT
                                // laneNumber={s.laneNumber} //commun
                                height={1 / stationsReady.length} //commun
                                repsOfFirst={repsOfFirst} //commun
                                // finishResult={
                                //     s.result?.replace("|", " | ") ||
                                //     (!s.measurements?.[currentIndex]
                                //         ? undefined
                                //         : s.measurements[currentIndex].method ===
                                //           "time"
                                //         ? toReadableTime(
                                //               s.measurements[currentIndex].value
                                //           )
                                //         : `${s.measurements[
                                //               currentIndex
                                //           ].value?.toString()} reps|`)
                                // }
                                primaryColor={
                                    competition?.primaryColor || "white"
                                } //commun
                                secondaryColor={
                                    competition?.secondaryColor || "white"
                                } //commun
                                rank={
                                    stationsReady
                                        .filter(
                                            (sR) =>
                                                sR.category === station.category
                                        )
                                        .map(
                                            (stationFiltered) =>
                                                stationFiltered.rank[
                                                    currentIndex
                                                ]
                                        )
                                        .sort((a, b) => a - b)
                                        .findIndex(
                                            (rank) =>
                                                rank ===
                                                station.rank[currentIndex]
                                        ) + 1
                                } // DIFFERENT
                            />
                        );
                    })}
                {/* {workout?.dataSource === "web" &&
                    fullStations
                        ?.sort((a, b) => a.laneNumber - b.laneNumber)
                        .sort(
                            (a, b) =>
                                a.rank[currentIndex] - b.rank[currentIndex]
                        )
                        .sort((a, b) => {
                            if (a.dynamics.result && !b.dynamics.result)
                                return -1;
                            if (!a.dynamics.result && b.dynamics.result)
                                return 1;
                            if (!a.dynamics.result && !b.dynamics.result)
                                return 0;
                            return (
                                Number(
                                    a.dynamics.result
                                        ?.replace(":", "")
                                        .replace("|", "")
                                ) -
                                Number(
                                    b.dynamics.result
                                        ?.replace(":", "")
                                        .replace("|", "")
                                )
                            );
                        })
                        .map((s) => {
                            const repsOfFirst =
                                allScores[currentIndex][currentIndex];
                            const workoutFlow = workouts.find(
                                (workout) =>
                                    workout.workoutIds.includes(
                                        globals?.externalWorkoutId.toString() ||
                                            ""
                                    ) && workout.index === currentIndex
                            );

                            const scores = [
                                ...new Set(
                                    fullStations.map(
                                        (statio) =>
                                            statio.dynamics.result ||
                                            statio.repsPerBlock[currentIndex]
                                    )
                                ),
                            ];

                            return (
                                <WodRunningAthlete
                                    key={s.laneNumber} //commun
                                    // workout={workoutFlow}
                                    options={workout.options} //commun
                                    repsCompleted={s.repsPerBlock[currentIndex]} // DIFFERENT
                                    participant={s.participant} //commun
                                    laneNumber={s.laneNumber} //commun
                                    height={1 / stations.length} //commun
                                    rank={
                                        scores.findIndex(
                                            (score) =>
                                                score ===
                                                (s.dynamics.result ||
                                                    s.repsPerBlock[
                                                        currentIndex
                                                    ])
                                        ) === -1
                                            ? scores.length + 1
                                            : scores.findIndex(
                                                  (score) =>
                                                      score ===
                                                      (s.dynamics.result ||
                                                          s.repsPerBlock[
                                                              currentIndex
                                                          ])
                                              ) + 1
                                    }
                                    repsOfFirst={repsOfFirst} //commun
                                    finishResult={s.dynamics.result} //DIFFERENT
                                    primaryColor={
                                        competition?.primaryColor || "red"
                                    } //commun
                                    secondaryColor={
                                        competition?.secondaryColor || "blue"
                                    } //commun
                                />
                            );
                        })}
                {workout?.dataSource === "iot" &&
                    stationsUpgraded
                        ?.sort((a, b) => a.laneNumber - b.laneNumber)
                        .sort(
                            (a, b) =>
                                // a.rank[a.rank.length - 1] -
                                // b.rank[a.rank.length - 1]
                                a.rank[currentIndex] - b.rank[currentIndex]
                        )
                        ?.map((s, i) => {
                            const repsOfFirst = stationsUpgraded
                                .map(
                                    (station) =>
                                        station.repsPerBlock?.[currentIndex]
                                )
                                .sort((a, b) => b - a)[0];

                            const workoutFlow = workouts.find(
                                (workout) =>
                                    workout.workoutIds.includes(
                                        globals?.externalWorkoutId.toString() ||
                                            ""
                                    ) && workout.index === currentIndex
                            );

                            return (
                                <>
                                    <WodRunningAthlete
                                        key={s.laneNumber} //commun
                                        options={workout.options} //commun
                                        // workout={workoutFlow}
                                        repsCompleted={
                                            s.repsPerBlock?.[currentIndex] || 0
                                        } // DIFFERENT
                                        participant={s.participant} //commun
                                        totalReps={totalReps} // DIFFERENT
                                        currentMovement={s.currentMovement} // DIFFERENT
                                        currentMovementReps={s.repsOfMovement} // DIFFERENT
                                        currentMovementTotalReps={
                                            s.totalRepsOfMovement
                                        } // DIFFERENT
                                        currentRound={s.position.round + 1} // DIFFERENT
                                        workoutType={
                                            workoutType as
                                                | "amrap"
                                                | "forTime"
                                                | "maxWeight"
                                        } // DIFFERENT
                                        laneNumber={s.laneNumber} //commun
                                        height={1 / stations.length} //commun
                                        repsOfFirst={repsOfFirst} //commun
                                        finishResult={
                                            s.result?.replace("|", " | ") ||
                                            (!s.measurements?.[currentIndex]
                                                ? undefined
                                                : s.measurements[currentIndex]
                                                      .method === "time"
                                                ? toReadableTime(
                                                      s.measurements[
                                                          currentIndex
                                                      ].value
                                                  )
                                                : `${s.measurements[
                                                      currentIndex
                                                  ].value?.toString()} reps|`)
                                        }
                                        primaryColor={
                                            competition?.primaryColor || "white"
                                        } //commun
                                        secondaryColor={
                                            competition?.secondaryColor ||
                                            "white"
                                        } //commun
                                        rank={
                                            stationsUpgraded
                                                .filter(
                                                    (station) =>
                                                        station.category ===
                                                        s.category
                                                )
                                                .map(
                                                    (stationFiltered) =>
                                                        stationFiltered.rank[
                                                            currentIndex
                                                        ]
                                                )
                                                .sort((a, b) => a - b)
                                                .findIndex(
                                                    (rank) =>
                                                        rank ===
                                                        s.rank[currentIndex]
                                                ) + 1
                                        } // DIFFERENT
                                    />
                                </>
                            );
                        })} */}
            </Stack>
            {/* </Grid> */}

            <Box
                position="absolute"
                top={"50%"}
                width={"50%"}
                right={35}
                sx={{ transform: "translateY(-50%)" }}
            >
                {globals?.state === 1 && (
                    <Typography
                        color={"gray"}
                        fontSize={"45rem"}
                        fontFamily={"CantoraOne"}
                        paddingRight={"200px"}
                    >
                        {timer?.toString().slice(1) || ""}
                    </Typography>
                )}
            </Box>
        </BigscreenLayout>
    );
};

export default BigScreen;
