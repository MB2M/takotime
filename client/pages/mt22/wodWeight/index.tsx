import { Typography, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import mtLogo from "../../../public/img/logo.png";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import Header from "../../../components/mt/Header";
import WodWeightRunningAthlete from "../../../components/mt/WodWeightRunningAthlete";
import { useEffect, useMemo, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import HeatPresentation from "../../../components/live/HeatPresentation";
import MTHeatWinner from "../../../components/mt/MTHeatWinner";

function WodWeightRunning() {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const stationsUpgraded = useStationPayload(stations, ranks);
    const [wodWeightInfo, setWodWeightInfo] = useState<any[]>([]);

    const allScores = useMemo(() => {
        return wodWeightInfo
            .map(
                (station) =>
                    station.scores
                        ?.sort(
                            (a: { weight: number }, b: { weight: number }) =>
                                b.weight - a.weight
                        )
                        .find(
                            (score: { state: string }) =>
                                score.state === "Success"
                        )?.weight
            )
            .sort((a, b) => (b || 0) - (a || 0));
    }, [wodWeightInfo]);

    const fullStations = useMemo(() => {
        return stationsUpgraded.map((stationUp) => {
            const wogWeightScore = wodWeightInfo
                ?.find(
                    (station: { laneNumber: number }) =>
                        station.laneNumber === stationUp.laneNumber
                )
                ?.scores?.sort(
                    (a: { weight: number }, b: { weight: number }) =>
                        b.weight - a.weight
                )
                .find(
                    (score: { state: string }) => score.state === "Success"
                )?.weight;

            return {
                ...stationUp,
                result: wogWeightScore,
                rank:
                    allScores.findIndex((score) => {
                        return score === wogWeightScore;
                    }) === -1
                        ? allScores.length + 1
                        : allScores.findIndex((score) => {
                              return score === wogWeightScore;
                          }) + 1,
            };
        });
    }, [stationsUpgraded, wodWeightInfo, allScores]);

    const allTry = useMemo(() => {
        return wodWeightInfo
            .map(
                (station) =>
                    station.scores
                        ?.sort(
                            (a: { weight: number }, b: { weight: number }) =>
                                b.weight - a.weight
                        )
                        .find(
                            (score: { state: string }) =>
                                score.state === "Try"
                        )?.weight
            )
            .sort((a, b) => (b || 0) - (a || 0));
    }, [wodWeightInfo]);

    const restrieveWodWeightInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setWodWeightInfo(json);
            } else {
                setWodWeightInfo([]);
            }
        } catch (err) {
            console.log(err);
            setWodWeightInfo([]);
        }
    };

    useInterval(restrieveWodWeightInfo, 1000);

    switch (globals?.state) {
        case 0:
            return <HeatPresentation />;
        case 3:
            return <MTHeatWinner stations={fullStations} />;
        default:
            return (
                <Box
                    sx={{
                        width: 1920,
                        height: 1080,
                        backgroundColor: "#242424",
                    }}
                >
                    <Grid
                        container
                        className="displayZone"
                        overflow={"hidden"}
                        gap={0}
                        spacing={0}
                        justifyContent="space-evenly"
                        sx={{
                            height: "100%",
                        }}
                    >
                        {fullStations
                            ?.sort((a, b) => a.laneNumber - b.laneNumber)
                            ?.map((s) => (
                                <Grid item xs={3} >
                                    <WodWeightRunningAthlete
                                        key={s.laneNumber}
                                        data={s}
                                        wodWeightData={wodWeightInfo?.find(
                                            (station) =>
                                                station.laneNumber ===
                                                s.laneNumber
                                        )}
                                        divNumber={stationsUpgraded.length}
                                        highestBar={allTry[0]}
                                    />
                                </Grid>
                            ))}
                    </Grid>

                    {/* <Box
                        zIndex={1}
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
                    </Box> */}
                </Box>
            );
    }
}

export default WodWeightRunning;
