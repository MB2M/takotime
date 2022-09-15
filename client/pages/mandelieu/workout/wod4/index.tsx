import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import useChrono from "../../../../hooks/useChrono";
import logo from "../../../../public/img/logoMandelieuBlanc.png";
import useStationPayload from "../../../../hooks/useStationPayload";
import { useEffect, useMemo, useState } from "react";
import useInterval from "../../../../hooks/useInterval";
import { workouts } from "../../../../eventConfig/mandelieu/config";

// import HeatPresentation from "../../../components/live/HeatPresentation";
// import HeatResult from "../../../components/live/HeatResult";
// import MTHeatWinner from "../../../components/mt/MTHeatWinner";
import Header from "../../../../components/mt/Header";
import WodRunningAthlete from "../../../../components/mandelieu/WodRunningAthlete";
import DisplayWeight from "../../../../components/mandelieu/displayWeight";

function Display() {
    const { globals, stations } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const [stationsInfo, setStationsInfo] = useState<BaseStation[]>([]);

    // const [wodCount, setWodCount] = useState<number>(0);

    // useEffect(() => {
    //     const count = workouts.filter((workout) =>
    //         workout.workoutIds.includes(
    //             globals?.externalWorkoutId.toString() || ""
    //         )
    //     ).length;
    //     setWodCount(count);
    // }, [workouts, globals?.externalWorkoutId]);

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

    switch (globals?.state) {
        default:
            return (
                <Box
                    sx={{
                        width: 1920,
                        height: 1080,
                        backgroundColor: "#242424",
                    }}
                >
                    <Header
                        logo={logo}
                        imageWidth={"200px"}
                        textTop={[
                            ...new Set(
                                stations?.map((station) => station.category)
                            ),
                        ].join(" / ")}
                        textTopFontSize={"6rem"}
                        chrono={chrono?.toString().slice(0, 5) || ""}
                    />
                    {/* CHANGE SCREEN AFTER 6' */}
                    {Number(chrono?.toString().replaceAll(":", "")) <
                        650000 && (
                        <Grid
                            container
                            display={"flex"}
                            justifyContent={"space-between"}
                            spacing={1}
                        >
                            <Grid
                                item
                                xs={12}
                                className="displayZone"
                                display={"flex"}
                                overflow={"hidden"}
                                gap={0}
                                sx={{
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    // height: "100%",
                                }}
                            >
                                <Typography
                                    fontSize="50px"
                                    textAlign={"center"}
                                    color={"white"}
                                    sx={{ fontFamily: "CantoraOne" }}
                                ></Typography>
                                {fullStations
                                    ?.sort(
                                        (a, b) => a.laneNumber - b.laneNumber
                                    )
                                    .sort((a, b) => a.rank[0] - b.rank[0])
                                    .sort((a, b) => {
                                        if (
                                            a.dynamics.result &&
                                            !b.dynamics.result
                                        )
                                            return -1;
                                        if (
                                            !a.dynamics.result &&
                                            b.dynamics.result
                                        )
                                            return 1;
                                        if (
                                            !a.dynamics.result &&
                                            !b.dynamics.result
                                        )
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
                                        const repsOfFirst = allScores[0][0];
                                        const workout = workouts.find(
                                            (workout) =>
                                                workout.workoutIds.includes(
                                                    globals?.externalWorkoutId.toString() ||
                                                        ""
                                                ) && workout.index === 0
                                        );
                                        const scores = [
                                            ...new Set(
                                                fullStations.map(
                                                    (statio) =>
                                                        statio.dynamics
                                                            .result ||
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
                                                divNumber={stations.length}
                                                repsCompleted={s.result[0]}
                                                rank={
                                                    scores.findIndex(
                                                        (score) =>
                                                            score ===
                                                            (s.dynamics
                                                                .result ||
                                                                s.result[0])
                                                    ) === -1
                                                        ? scores.length + 1
                                                        : scores.findIndex(
                                                              (score) =>
                                                                  score ===
                                                                  (s.dynamics
                                                                      .result ||
                                                                      s
                                                                          .result[0])
                                                          ) + 1
                                                }
                                                repsOfFirst={repsOfFirst}
                                                fullWidth={1920}
                                                finishResult={s.dynamics.result}
                                            />
                                        );
                                    })}
                            </Grid>
                        </Grid>
                    )}
                    {Number(chrono?.toString().replaceAll(":", "")) >
                        650000 && (
                        <DisplayWeight
                            heatId={globals?.externalHeatId}
                            stations={stations}
                        />
                    )}
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
                </Box>
            );
    }
}

export default Display;
