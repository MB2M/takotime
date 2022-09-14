import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import WodWeightRunningAthlete from "./WodWeightRunningAthlete";
import { useState, useMemo } from "react";
import useInterval from "../../hooks/useInterval";

function DisplayWeight({
    heatId,
    stations,
}: {
    heatId: number | undefined;
    stations: Station[];
}) {
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
        return stations.map((stationUp) => {
            const wogWeightScore0 = wodWeightInfo
                ?.find(
                    (station: { laneNumber: number }) =>
                        station.laneNumber === stationUp.laneNumber
                )
                ?.scores?.sort(
                    (a: { weight: number }, b: { weight: number }) =>
                        b.weight - a.weight
                )
                .find(
                    (score: {
                        partnerId: number; state: string 
}) =>
                        score.state === "Success" && score.partnerId === 0
                )?.weight;
            const wogWeightScore1 = wodWeightInfo
                ?.find(
                    (station: { laneNumber: number }) =>
                        station.laneNumber === stationUp.laneNumber
                )
                ?.scores?.sort(
                    (a: { weight: number }, b: { weight: number }) =>
                        b.weight - a.weight
                )
                .find(
                    (score: {
                        partnerId: number; state: string 
}) =>
                        score.state === "Success" && score.partnerId === 1
                )?.weight;

            return {
                ...stationUp,
                result0: wogWeightScore0,
                result1: wogWeightScore1,
                rank:
                    allScores.findIndex((score) => {
                        return score === wogWeightScore0;
                    }) === -1
                        ? allScores.length + 1
                        : allScores.findIndex((score) => {
                              return score === wogWeightScore0;
                          }) + 1,
            };
        });
    }, [stations, wodWeightInfo, allScores]);

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
                            (score: { state: string }) => score.state === "Try"
                        )?.weight
            )
            .sort((a, b) => (b || 0) - (a || 0));
    }, [wodWeightInfo]);

    const restrieveWodWeightInfo = async () => {
        if (!heatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station?heatId=${heatId}`,
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

    return (
        // <Box
        //     sx={{
        //         width: 1920,
        //         height: 1080,
        //         backgroundColor: "#242424",
        //     }}
        // >
        <Grid
            container
            overflow={"hidden"}
            gap={0}
            spacing={2}
            justifyContent="space-evenly"
            alignItems={"center"}
            // sx={{
            //     height: "100%",
            // }}
        >
            {fullStations
                ?.sort((a, b) => a.laneNumber - b.laneNumber)
                ?.map((s) => (
                    <Grid item xs={3}>
                        <WodWeightRunningAthlete
                            key={s.laneNumber}
                            data={s}
                            wodWeightData={wodWeightInfo?.find(
                                (station) => station.laneNumber === s.laneNumber
                            )}
                            divNumber={stations.length}
                            highestBar={allTry[0]}
                        />
                    </Grid>
                ))}
        </Grid>
        // </Box>
    );
}

export default DisplayWeight;
