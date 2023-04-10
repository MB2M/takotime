import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import HeaderMT from "../../../components/mt/HeaderMT";
import { useMemo, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import WodGymOverlayRunningAthlete from "../../../components/mt/WodGymOverlayRunningAthlete";
import OverlayPresentation from "../../../components/live/overlay/OverlayPresentation";
import MTOverlayResult from "../../../components/mt/MTOverlayResult";
import OverlayLogo from "../../../components/live/overlay/OverlayLogo";

function WodGymRunningOverlay() {
    const { globals, stations, ranks } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);
    const stationsUpgraded = useStationPayload(stations, ranks);
    const [wodGymInfo, setWodGymInfo] = useState<GymStation[]>([]);
    const [heatConfig, setHeatConfig] = useState<HeatConfig | undefined>();
    const CCData = useCompetitionCornerContext();

    const allScores = useMemo(() => {
        return wodGymInfo
            .map((station) =>
                station.scores?.reduce(
                    (p, c) =>
                        p +
                        (c.gymRepCount || 0) *
                            (heatConfig?.rounds?.find(
                                (score) => score.roundNumber === c.roundNumber
                            )?.pointsPerMovement || 1),
                    0
                )
            )
            .sort((a, b) => (b || 0) - (a || 0));
    }, [wodGymInfo]);

    const fullStations = useMemo(() => {
        return stationsUpgraded.map((stationUp) => {
            const wogGymScore = wodGymInfo
                ?.find((station) => station.laneNumber === stationUp.laneNumber)
                ?.scores?.reduce(
                    (p, c) =>
                        p +
                        (c.gymRepCount || 0) *
                            (heatConfig?.rounds?.find(
                                (score) => score.roundNumber === c.roundNumber
                            )?.pointsPerMovement || 1),
                    0
                );

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
            return (
                <>
                    <OverlayLogo />
                    <OverlayPresentation />
                </>
            );
        case 3:
            return (
                <>
                    <OverlayLogo />
                    <MTOverlayResult stations={fullStations} />
                </>
            );
        default:
            return (
                <>
                    <OverlayLogo />
                    <Box
                        className="displayZone"
                        overflow={"hidden"}
                        sx={{
                            width: 1920,
                            height: 1080,
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <HeaderMT
                            // logo={mtLogo}
                            chrono={timer?.toString().slice(0, 5) || ""}
                            chronoFontSize="4rem"
                            textTop={CCData?.epHeat?.[0].heatName}
                            textTopFontSize="4rem"
                            imageWidth={"110px"}
                            backgroundColor="black"
                        />
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={2}
                            height="100%"
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={2}
                                height="100%"
                            >
                                <Stack
                                    direction="column"
                                    alignItems="flex-start"
                                    spacing={2}
                                    paddingTop={1}
                                    height="100%"
                                >
                                    {fullStations
                                        ?.sort(
                                            (a, b) =>
                                                a.laneNumber - b.laneNumber
                                        )
                                        .slice(
                                            0,
                                            fullStations.length / 2 +
                                                (fullStations.length % 2)
                                        )
                                        ?.map((s) => (
                                            <WodGymOverlayRunningAthlete
                                                key={s.laneNumber}
                                                data={s}
                                                wodGymData={wodGymInfo?.find(
                                                    (station) =>
                                                        station.laneNumber ===
                                                        s.laneNumber
                                                )}
                                                heatConfig={heatConfig}
                                                position={"left"}
                                            />
                                        ))}
                                </Stack>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-end"
                                spacing={2}
                                height="100%"
                            >
                                <Stack
                                    direction="column"
                                    alignItems="flex-end"
                                    spacing={2}
                                    paddingTop={1}
                                    height="100%"
                                >
                                    {fullStations
                                        ?.sort(
                                            (a, b) =>
                                                a.laneNumber - b.laneNumber
                                        )
                                        .slice(
                                            fullStations.length / 2 +
                                                (fullStations.length % 2)
                                        )
                                        ?.map((s) => (
                                            <WodGymOverlayRunningAthlete
                                                key={s.laneNumber}
                                                data={s}
                                                wodGymData={wodGymInfo?.find(
                                                    (station) =>
                                                        station.laneNumber ===
                                                        s.laneNumber
                                                )}
                                                heatConfig={heatConfig}
                                                position={"right"}
                                            />
                                        ))}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </>
            );
    }
}

export default WodGymRunningOverlay;
