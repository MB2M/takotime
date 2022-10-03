import { Box, Grid, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import WodRunningAthlete from "../components/bigscreen/WodRunningAthlete";
import HeaderMT from "../components/mt/HeaderMT";
import { useCompetitionContext } from "../context/competition";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";
import { useLiveDataContext } from "../context/liveData/livedata";
import { logo, workouts } from "../eventConfig/mandelieu/config";
import useChrono from "../hooks/useChrono";
import useInterval from "../hooks/useInterval";

const HEADER_HEIGHT = 150;

const BigScreen = () => {
    const { globals, stations } = useLiveDataContext();
    const [stationsInfo, setStationsInfo] = useState<BaseStation[]>([]);
    const chrono = useChrono(globals?.startTime, globals?.duration);

    const allScores = useMemo(() => {
        return [
            stationsInfo
                .map(
                    (station) =>
                        station.scores?.find((score) => score.index === 0)
                            ?.repCount || 0
                )
                .sort((a, b) => (b || 0) - (a || 0)),
            stationsInfo
                .map(
                    (station) =>
                        station.scores?.find((score) => score.index === 1)
                            ?.repCount || 0
                )
                .sort((a, b) => (b || 0) - (a || 0)),
        ];
    }, [stationsInfo]);

    const fullStations = useMemo(() => {
        return stations.map((stationUp) => {
            return {
                ...stationUp,
                result: [
                    stationsInfo
                        ?.find(
                            (station) =>
                                station.laneNumber === stationUp.laneNumber
                        )
                        ?.scores?.find((score) => score.index === 0)
                        ?.repCount || 0,
                    stationsInfo
                        ?.find(
                            (station) =>
                                station.laneNumber === stationUp.laneNumber
                        )
                        ?.scores?.find((score) => score.index === 1)
                        ?.repCount || 0,
                ],
                rank: allScores.map((scoreIndex, i) =>
                    scoreIndex.findIndex((score, index) => {
                        return (
                            score ===
                            stationsInfo
                                ?.find(
                                    (station) =>
                                        station.laneNumber ===
                                        stationUp.laneNumber
                                )
                                ?.scores?.find((score) => score.index === i)
                                ?.repCount
                        );
                    }) === -1
                        ? scoreIndex.length + 1
                        : scoreIndex.findIndex((score) => {
                              return (
                                  score ===
                                  stationsInfo
                                      ?.find(
                                          (station) =>
                                              station.laneNumber ===
                                              stationUp.laneNumber
                                      )
                                      ?.scores?.find(
                                          (score) => score.index === i
                                      )?.repCount
                              );
                          }) + 1
                ),
            };
        });
    }, [stationsInfo, allScores]);

    const restrieveWodGymInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setStationsInfo(json);
            } else {
                setStationsInfo([]);
            }
        } catch (err) {
            console.log(err);
            setStationsInfo([]);
        }
    };

    useInterval(() => {
        restrieveWodGymInfo();
    }, 1000);

    return (
        <BigscreenLayout headerHeight={HEADER_HEIGHT}>
            <Stack overflow={"hidden"} height={1}>
                {fullStations
                    ?.sort((a, b) => a.laneNumber - b.laneNumber)
                    .sort((a, b) => a.rank[0] - b.rank[0])
                    .sort((a, b) => {
                        if (a.dynamics.result && !b.dynamics.result) return -1;
                        if (!a.dynamics.result && b.dynamics.result) return 1;
                        if (!a.dynamics.result && !b.dynamics.result) return 0;
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
                        const repsOfFirst = allScores[0][0];
                        const workout = workouts.find(
                            (workout) =>
                                workout.workoutIds.includes(
                                    globals?.externalWorkoutId.toString() || ""
                                ) && workout.index === 0
                        );

                        const scores = [
                            ...new Set(
                                fullStations.map(
                                    (statio) =>
                                        statio.dynamics.result ||
                                        statio.result[0]
                                )
                            ),
                        ];

                        return (
                            <WodRunningAthlete
                                key={s.laneNumber}
                                workout={workout}
                                participant={s.participant}
                                laneNumber={s.laneNumber}
                                height={1 / stations.length}
                                repsCompleted={s.result[0]}
                                rank={
                                    scores.findIndex(
                                        (score) =>
                                            score ===
                                            (s.dynamics.result || s.result[0])
                                    ) === -1
                                        ? scores.length + 1
                                        : scores.findIndex(
                                              (score) =>
                                                  score ===
                                                  (s.dynamics.result ||
                                                      s.result[0])
                                          ) + 1
                                }
                                repsOfFirst={repsOfFirst}
                                fullWidth={1920}
                                finishResult={s.dynamics.result}
                            />
                        );
                    })}
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
                        {chrono?.toString().slice(1) || ""}
                    </Typography>
                )}
            </Box>
        </BigscreenLayout>
    );
};

export default BigScreen;
