import { Box, Button, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "../../../context/competition";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationReady from "../../../hooks/bigscreen/useStationReady";
import useChrono from "../../../hooks/useChrono";
import Chrono from "../../../components/bigscreen/Chrono";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toReadableTime } from "../../../components/bigscreen/WodRunningAthlete";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import { useRouter } from "next/router";
import { formatChrono } from "../../../utils/timeConverter";

const RemoteFTD23 = () => {
    const router = useRouter();
    const { laneNumber } = useMemo(
        () => router.query as { laneNumber: string },
        [router]
    );

    const [tieBreak, setTieBreak] = useState<string | number | null>(null);
    const [saved, setSaved] = useState<boolean>(false);

    const [parent] = useAutoAnimate({ duration: 500, easing: "ease-in-out" });
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
    const CCData = useCompetitionCornerContext();
    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );

    const { timer, extractTimer } = useChrono(
        globals?.startTime,
        globals?.duration
    );

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

    const stationsReady = useStationReady(
        workout?.dataSource,
        workout?.options?.rankBy,
        0
    );

    const currentCCHeat = CCData.heats.find(
        (heat) => heat.id === globals?.externalHeatId
    );

    const athlete = useMemo(
        () =>
            stationsReady?.find(
                (station) => station.laneNumber === +laneNumber
            ),
        [stationsReady]
    );

    useEffect(() => {
        setTieBreak("");
    }, [globals?.startTime]);

    const score = () => {
        if (!athlete) return "";

        const finishResult =
            athlete.result?.replace("|", " | ") ||
            (!athlete.measurements?.[currentIndex]
                ? undefined
                : athlete.measurements[currentIndex].method === "time"
                ? toReadableTime(athlete.measurements[currentIndex].value)
                : `${athlete.measurements[
                      currentIndex
                  ].value?.toString()} reps|`);

        if (!finishResult) return "";

        return finishResult.includes("CAP")
            ? "CAP"
            : finishResult.slice(0, finishResult.length - 2);
    };

    const scoresSaved = useMemo(
        () =>
            CCData.results.find(
                (result) => result.participantId === athlete?.externalId
            )?.scores,
        [CCData.results, athlete?.externalId]
    );

    useEffect(() => {
        if (scoresSaved?.[1]) {
            setTieBreak(scoresSaved[1]);
            setSaved(true);
        }
    }, [scoresSaved]);

    const handleTieBreakClick = async () => {
        const timeBreakTime = extractTimer();

        setTieBreak(timeBreakTime);
        if (!athlete) return;
        const payload = [
            {
                id: athlete.externalId,
                score: 3,
                secondaryScore: null,
                tiebreakerScore: formatChrono(timeBreakTime, false),
                isCapped: true,
                scaled: false,
                didNotFinish: false,
            },
        ];

        try {
            const response = await fetch("/api/updateResults", {
                method: "POST",
                body: JSON.stringify({
                    eventId: globals?.externalEventId,
                    workoutId: globals?.externalWorkoutId,
                    payload,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                return setSaved(false);
            }
            setSaved(true);
        } catch (error) {
            console.log(error);
            setSaved(false);
        }
    };

    return (
        <Box
            sx={{ backgroundColor: "#58585e" }}
            height={1}
            minHeight={"100vh"}
            ref={parent}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                color={"#f1f1f1"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={2}
                px={2}
                py={2}
            >
                <Typography
                    component={"h4"}
                    variant={"h4"}
                    fontSize={"1.5rem"}
                    alignItems={"center"}
                >
                    {currentCCHeat?.divisions} - {currentCCHeat?.title}
                </Typography>
                <Chrono
                    reverse={workout?.options?.chronoDirection === "desc"}
                    fontSize={"3rem"}
                    fontFamily={"chakraPetchItalic"}
                />
            </Box>
            <Box
                display={"flex"}
                flexDirection={"column"}
                color={"#f1f1f1"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={2}
                px={2}
                gap={4}
            >
                <Typography
                    component={"h4"}
                    variant={"h4"}
                    fontSize={"1.5rem"}
                    fontFamily={"Inconsolata"}
                    fontWeight={"bold"}
                >
                    Lane {athlete?.laneNumber}
                </Typography>
                <Typography
                    component={"h4"}
                    variant={"h4"}
                    fontSize={"2.5rem"}
                    fontFamily={"chakraPetchItalic"}
                    textAlign={"center"}
                >
                    {athlete?.participant}
                </Typography>
                {timer &&
                    (tieBreak ? (
                        <Box>
                            <Typography
                                component={"h4"}
                                variant={"h4"}
                                fontSize={"1.5rem"}
                                alignItems={"center"}
                                fontFamily={"Inconsolata"}
                                fontWeight={"bold"}
                            >
                                Tie Break
                            </Typography>

                            <Typography
                                component={"h4"}
                                variant={"h4"}
                                fontSize={"2.5rem"}
                                alignItems={"center"}
                                fontFamily={"chakraPetchItalic"}
                            >
                                {formatChrono(tieBreak, false)}
                            </Typography>
                            <Typography
                                fontSize={"0.7rem"}
                                color={saved ? "green" : "red"}
                            >
                                {saved ? "Saved" : "Not Saved"}
                            </Typography>
                        </Box>
                    ) : (
                        score().length < 1 && (
                            <Button
                                variant={"contained"}
                                color={"error"}
                                sx={{ backgroundColor: "#dd383f" }}
                                onClick={handleTieBreakClick}
                            >
                                Tie Break !
                            </Button>
                        )
                    ))}
                {score().length > 0 && (
                    <>
                        <Typography
                            component={"h4"}
                            variant={"h4"}
                            fontSize={"1.5rem"}
                            alignItems={"center"}
                            fontFamily={"Inconsolata"}
                            fontWeight={"bold"}
                        >
                            Current Score
                        </Typography>
                        <Typography
                            component={"h4"}
                            variant={"h4"}
                            fontSize={"2.5rem"}
                            alignItems={"center"}
                            fontFamily={"chakraPetchItalic"}
                        >
                            {score()}
                        </Typography>
                        {/*<Typography*/}
                        {/*    fontSize={"0.7rem"}*/}
                        {/*    color={scoreSaved ? "green" : "red"}*/}
                        {/*>*/}
                        {/*    {scoreSaved ? "Saved" : "Not Saved"}*/}
                        {/*</Typography>*/}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default RemoteFTD23;
