import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import useStationPayload from "../../../hooks/useStationPayload";
import useInterval from "../../../hooks/useInterval";
import HeatPresentation from "../../../components/live/HeatPresentation";
import MTHeatWinner from "../../../components/mt/MTHeatWinner";
import WodWeightRunningAthlete2 from "../../../components/mt/WodWeightRunningAthlete2";
import { useMemo, useState } from "react";

function WodWeightRunning() {
    const { globals, stations, ranks } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);
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
                            ?.map((s) => (
                                <WodWeightRunningAthlete2
                                    key={s.laneNumber}
                                    data={s}
                                    wodWeightData={wodWeightInfo?.find(
                                        (station) =>
                                            station.laneNumber === s.laneNumber
                                    )}
                                    divNumber={stationsUpgraded.length}
                                />
                            ))}
                    </Box>

                    <Box
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
                                {timer?.toString().slice(1) || ""}
                            </Typography>
                        )}
                    </Box>
                </Box>
            );
    }
}

export default WodWeightRunning;
