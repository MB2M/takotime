import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import mtLogo from "../../../public/img/logo.png";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import Header from "../../../components/mt/Header";
import WodWeightRunningAthlete from "../../../components/mt/WodWeightRunningAthlete";
import { useEffect, useState } from "react";
import useInterval from "../../../hooks/useInterval";

function WodWeightRunning() {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const stationsUpgraded = useStationPayload(stations, ranks);
    const [wodWeightInfo, setWodWeightInfo] = useState<any[]>([]);

    const restrieveStationInfo = async () => {
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
    useInterval(restrieveStationInfo, 1000)


    return (
        <Box sx={{ width: 1920, height: 1080, backgroundColor: "#242424" }}>
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
                {stationsUpgraded
                    ?.sort((a, b) => a.laneNumber - b.laneNumber)
                    ?.map((s) => (
                        <WodWeightRunningAthlete
                            key={s.laneNumber}
                            data={s}
                            wodWeightData={wodWeightInfo?.find(
                                (station) => station.laneNumber === s.laneNumber
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
                        {chrono?.toString().slice(1) || ""}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default WodWeightRunning;
