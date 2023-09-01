import useStationWs from "../hooks/bigscreen/useStationWs";
import { Box } from "@mui/system";
import { Button, Stack, Typography } from "@mui/material";
import { useCompetitionContext } from "../context/competition";
import { useCallback, useEffect, useState } from "react";
import { useLiveDataContext } from "../context/liveData/livedata";
import HeadTakoStation from "../components/headTako/HeadTakoStation";
import useHeatDivisionInfo from "../hooks/cc/useHeatDivisionInfo";
import Image from "next/future/image";
import Chrono from "../components/bigscreen/Chrono";

const HeadTako = () => {
    const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const { sendMessage } = useLiveDataContext();
    const { heatName } = useHeatDivisionInfo();

    const { fullStations, workouts, results } = useStationWs();

    const [currentCCScores, setCurrentCCScores] = useState<
        { id: number; result: string }[][]
    >([]);

    const refreshCCScores = useCallback(async () => {
        if (!competition?.eventId || !workouts) return;

        // const scores: { id: number; result: string }[][] = [];

        const scores = await Promise.all(
            workouts.map(async (workout) => {
                try {
                    const response = await fetch(
                        `/api/results/byWorkout?eventId=${competition.eventId}&workoutId=${workout.workoutId}`
                    );
                    // console.log(await response.json());
                    if (!response.ok) {
                        throw new Error(await response.text());
                    }
                    return await response.json();
                } catch (e) {
                    console.log(e);
                }
            })
        );
        setCurrentCCScores(scores.filter((score) => !!score));
    }, [workouts, competition?.eventId]);

    useEffect(() => {
        refreshCCScores();
        const interval = setInterval(() => {
            refreshCCScores();
        }, 5000);

        return () => clearInterval(interval);
    }, [refreshCCScores]);

    const postAllScores = () => {
        fullStations.forEach((station) => {
            sendMessage(
                JSON.stringify({
                    topic: "save",
                    data: { laneNumber: station.laneNumber },
                })
            );
        });
        setTimeout(() => refreshCCScores(), 2000);
    };

    const onPostScore = (laneNumber: number) => {
        sendMessage(JSON.stringify({ topic: "save", data: { laneNumber } }));
        setTimeout(() => refreshCCScores(), 2000);
    };

    const onRepClick = ({
        station,
        value,
        participantId,
        category,
    }: {
        station: number;
        value: number;
        participantId: string;
        category: string;
    }) => {
        sendMessage(
            JSON.stringify({
                topic: "newRep",
                data: {
                    station,
                    value,
                    wodIndex: workouts[0].workoutId,
                    participantId,
                    category,
                    heatId: globals?.externalHeatId,
                },
            })
        );
    };

    return (
        <Box
            sx={{
                backgroundColor: "#101010",
                minHeight: "100vh",
            }}
            px={2}
        >
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Image src={`/api/images/${competition?.logoUrl}`} width={50} />
                <Typography
                    color={"white"}
                    fontFamily={"bebasNeue"}
                    fontSize={"2rem"}
                >
                    {heatName}
                </Typography>
                <Chrono fontSize={"2rem"} fontFamily={"ChivoMono"} />
                <Button onClick={postAllScores}>Post all scores</Button>
            </Box>

            <Stack gap={1} justifyContent={"space-between"}>
                {fullStations
                    .sort((a, b) => a.laneNumber - b.laneNumber)
                    .map((station) => (
                        <HeadTakoStation
                            key={station.laneNumber}
                            station={station}
                            currentCCScore={currentCCScores.map(
                                (scoreList) =>
                                    scoreList.find(
                                        (score) =>
                                            score.id === station.externalId
                                    )?.result || "-"
                            )}
                            results={results.map((r) =>
                                r.results.filter(
                                    (rr) =>
                                        rr.participantId === station.externalId
                                )
                            )}
                            workouts={workouts}
                            onPostScore={onPostScore}
                            onRepClick={onRepClick}
                        />
                    ))}
            </Stack>
        </Box>
    );
};
export default HeadTako;
