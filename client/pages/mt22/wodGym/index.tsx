import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import mtLogo from "../../../public/img/logo.png";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import HeaderMT from "../../../components/mt/HeaderMT";
import { useEffect, useMemo, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import WodGymRunningAthlete from "../../../components/mt/WodGymRunningAthlete";
import HeatPresentation from "../../../components/live/HeatPresentation";
import HeatResult from "../../../components/live/HeatResult";
import MTHeatWinner from "../../../components/mt/MTHeatWinner";

function WodGymRunning() {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const stationsUpgraded = useStationPayload(stations, ranks);
    const [wodGymInfo, setWodGymInfo] = useState<GymStation[]>([]);
    const [heatConfig, setHeatConfig] = useState<HeatConfig | undefined>();

    const allScores = useMemo(() => {
        return wodGymInfo
            .map((station) =>
                station.scores?.reduce((p, c) => p + (c.gymRepCount || 0), 0)
            )
            .sort((a, b) => (b || 0) - (a || 0));
    }, [wodGymInfo]);

    const fullStations = useMemo(() => {
        return stationsUpgraded.map((stationUp) => {
            const wogGymScore = wodGymInfo
                ?.find((station) => station.laneNumber === stationUp.laneNumber)
                ?.scores?.reduce((p, c) => p + (c.gymRepCount || 0), 0);

            return {
                ...stationUp,
                result: wogGymScore,
                rank:
                    allScores.findIndex((score) => {
                        return score === wogGymScore;
                    }) === -1
                        ? allScores.length + 1
                        : allScores.findIndex((score) => {
                              return score === wogGymScore;
                          }) + 1,
            };
        });
    }, [stationsUpgraded, wodGymInfo, allScores]);

    const restrieveWodGymInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodGym/station?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setWodGymInfo(json);
            } else {
                setWodGymInfo([]);
            }
        } catch (err) {
            console.log(err);
            setWodGymInfo([]);
        }
    };

    const restrieveHeatConfigInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodGym/heatconfig/${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setHeatConfig(json);
            } else {
                setHeatConfig(undefined);
            }
        } catch (err) {
            console.log(err);
            setHeatConfig(undefined);
        }
    };

    useInterval(() => {
        restrieveWodGymInfo();
        restrieveHeatConfigInfo();
    }, 1000);

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
                    <Box
                        className="displayZone"
                        display={"flex"}
                        overflow={"hidden"}
                        gap={0}
                        sx={{
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            height: "100%",
                        }}
                    >
                        {fullStations
                            ?.sort((a, b) => a.laneNumber - b.laneNumber)
                            ?.map((s) => {
                                const wogGym = wodGymInfo?.find(
                                    (station) =>
                                        station.laneNumber === s.laneNumber
                                );

                                return (
                                    <WodGymRunningAthlete
                                        key={s.laneNumber}
                                        data={s}
                                        wodGymData={wogGym}
                                        divNumber={stationsUpgraded.length}
                                        heatConfig={heatConfig}
                                        rank={s.rank}
                                    />
                                );
                            })}
                    </Box>

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

export default WodGymRunning;
