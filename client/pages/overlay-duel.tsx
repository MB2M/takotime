import { Box, Grow, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import { workouts } from "../eventConfig/FTD23Qualif/config";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import Image from "next/image";
import { useRouter } from "next/router";
import Chrono from "../components/bigscreen/Chrono";
import { AthleteDuel } from "../components/overlayDuel/AthleteDuel";
import toReadableTime from "../utils/timeConverter";
import { cumulativeTable } from "../utils/cumulativeTable";
import useInterval from "../hooks/useInterval";

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = HEADER_HEIGHT / 2.8;
const ATHLETE_HEIGHT = 2.8 * 16;

const getRoundRecord = (
    times: { rep: number; time: number; index: number }[],
    totalRepsOfRound: number
) => {
    return times
        .reverse()
        .filter(
            (time, index) =>
                index === times.findIndex((t) => t.rep === time.rep)
        )
        .filter((time) => time.rep % totalRepsOfRound === 0)
        .sort((a, b) => a.rep - b.rep);
};

const Overlay = () => {
    const [wodWeightInfo, setWodWeightInfo] = useState<WodWeightStation[]>([]);
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
    // const { heats } = useCompetitionCornerContext();
    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );

    const router = useRouter();
    const title = router.query.title;

    const { timer, plainTimer } = useChrono(
        globals?.startTime,
        globals?.duration
    );

    const currentIndex = useMemo(() => {
        if (!workout?.wodIndexSwitchMinute) return 0;
        if (+workout.wodIndexSwitchMinute === 0) return 0;
        if (plainTimer < +workout.wodIndexSwitchMinute * 60 * 1000) return 0;

        //ALERT: ONLY FOR WOD 3 QUALIFS FTD
        if (workout.workoutId === "wod3" && plainTimer > 13 * 60 * 1000)
            // 5 minutes
            return 2;

        return 1;
    }, [timer, workout?.wodIndexSwitchMinute]);

    const workoutType = workout?.options?.wodtype;

    const stationsReady = useStationReady(
        workout?.dataSource,
        workout?.options?.rankBy,
        currentIndex
    );

    const logoUrl = useMemo(
        () =>
            workout?.options?.logo
                ? `/api/images/${competition?.logoUrl}`
                : "/api/images/tako.png",
        [workout?.options?.logo]
    );

    const workoutFlow = useMemo(
        () =>
            workouts.find(
                (workout) =>
                    workout.workoutIds.includes(
                        globals?.externalWorkoutId.toString() || ""
                    ) && workout.index === currentIndex
            ),
        [workout, globals, currentIndex]
    );

    const repsOfFirst = useMemo(
        () =>
            stationsReady
                ?.map((station) => station.repsPerBlock?.[currentIndex])
                .sort((a, b) => b - a)[0],
        [stationsReady, currentIndex]
    );

    const workoutDescription = useMemo(() => {
        if (!workoutFlow?.main.movements) return [];
        const movements: string[] = [];
        for (let i = 0; i < workoutFlow.main.movements.length; i++) {
            movements.push(
                `${workoutFlow.main.reps[i]} ${workoutFlow.main.movements[i]}`
            );
        }
        return movements;
    }, [workoutFlow]);

    const mvtsIndexOfFirst = useMemo(() => {
        const cumulativeReps = cumulativeTable(workoutFlow?.main.reps || []);
        return cumulativeReps.findIndex(
            (cumRep) =>
                (repsOfFirst || 0) % cumulativeReps[cumulativeReps.length - 1] <
                cumRep
        );
    }, [repsOfFirst]);

    const roundTimeRecordRef = useRef<
        { rep: number; time: number; index: number }[][]
    >([[], []]);
    const [showRoundTimer, setShowRoundTimer] = useState(false);

    const lastRoundTimes = useMemo(() => {
        const firstAth = stationsReady?.[0]?.times?.[currentIndex] || [];
        const secondAth = stationsReady?.[1]?.times?.[currentIndex] || [];
        const totalRepsOfRound =
            workoutFlow?.main.reps.reduce((p, c) => p + c, 0) || 0;

        return [
            getRoundRecord(firstAth, totalRepsOfRound),
            getRoundRecord(secondAth, totalRepsOfRound),
        ];
    }, [
        stationsReady?.[0]?.times?.[currentIndex],
        stationsReady?.[1]?.times?.[currentIndex],
    ]);

    const showRoundTime = () => {
        setShowRoundTimer(true);
        setTimeout(() => setShowRoundTimer(false), 10000);
    };

    useEffect(() => {
        if (
            roundTimeRecordRef.current?.[0]?.length !==
                lastRoundTimes[0].length ||
            roundTimeRecordRef.current?.[1]?.length !== lastRoundTimes[1].length
        ) {
            roundTimeRecordRef.current = lastRoundTimes;
            showRoundTime();
        }
    }, [lastRoundTimes]);

    const restrieveWodWeightInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station?heatId=${globals.externalHeatId}`,
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
        <Box height={1080} overflow={"hidden"}>
            {workoutType === "amrap" && (
                <Grow in={showRoundTimer}>
                    <Box
                        position={"absolute"}
                        bottom={FOOTER_HEIGHT + 30}
                        height={90}
                        width={1}
                        sx={{
                            background:
                                "linear-gradient(135deg, #393873 40%, #39387300 40%),linear-gradient(45deg, #39387300 60%,#393873 60%)",
                        }}
                        display={"flex"}
                        justifyContent={"space-around"}
                        alignItems={"center"}
                    >
                        {lastRoundTimes.map((athleteTimer, index) => (
                            <Box
                                key={index}
                                display={"flex"}
                                flexDirection={index ? "row-reverse" : "row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                gap={20}
                                width={1}
                            >
                                <Box textAlign={"center"}>
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        average round
                                    </Typography>
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        {athleteTimer.length > 0
                                            ? toReadableTime(
                                                  athleteTimer[
                                                      athleteTimer.length - 1
                                                  ]?.time / athleteTimer.length,
                                                  false
                                              )
                                            : "-"}
                                    </Typography>
                                </Box>
                                <Box textAlign={"center"}>
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        Last round
                                    </Typography>
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        {athleteTimer.length
                                            ? toReadableTime(
                                                  athleteTimer[
                                                      athleteTimer.length - 1
                                                  ]?.time -
                                                      (athleteTimer[
                                                          athleteTimer.length -
                                                              2
                                                      ]?.time || 0),
                                                  false
                                              )
                                            : "-"}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Grow>
            )}
            {workout?.workoutId === "wod3" && currentIndex !== 1 && (
                <Box
                    position={"absolute"}
                    bottom={FOOTER_HEIGHT}
                    height={70}
                    width={1}
                    sx={{
                        background:
                            "linear-gradient(45deg, #393873 40%, #39387300 40%),linear-gradient(135deg, #39387300 60%,#393873 60%)",
                    }}
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                >
                    {wodWeightInfo
                        .sort(
                            (a, b) => (a.laneNumber || 0) - (b.laneNumber || 0)
                        )
                        .map((athleteWeightInfo, index) => (
                            <Box
                                key={index}
                                display={"flex"}
                                flexDirection={index ? "row-reverse" : "row"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                width={1}
                                pr={index ? 5 : 30}
                                pl={index ? 30 : 5}
                            >
                                <Box textAlign={index ? "end" : "start"}>
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"1.6rem"}
                                        lineHeight={"2rem"}
                                    >
                                        Previous
                                    </Typography>
                                    <Box
                                        display={"flex"}
                                        flexDirection={
                                            index ? "row" : "row-reverse"
                                        }
                                        gap={2}
                                    >
                                        {athleteWeightInfo.scores
                                            ?.filter(
                                                (score) =>
                                                    [
                                                        "Success",
                                                        "Fail",
                                                    ].includes(score.state) &&
                                                    score.partnerId ===
                                                        (!!currentIndex ? 1 : 0)
                                            )
                                            // .sort((a, b) =>
                                            //     a.weight === b.weight
                                            //         ? a.state === "Fail"
                                            //             ? 1
                                            //             : -1
                                            //         : 1
                                            // )
                                            ?.reverse()
                                            .slice(0, 6)
                                            .map((score, index) => (
                                                <Box
                                                    display={"flex"}
                                                    key={index}
                                                >
                                                    <Typography
                                                        color={"white"}
                                                        fontFamily={"BebasNeue"}
                                                        fontSize={"1.6rem"}
                                                        lineHeight={"2rem"}
                                                    >
                                                        {score.weight || "-"} kg
                                                    </Typography>

                                                    <Typography
                                                        fontSize={"0.8rem"}
                                                        lineHeight={"2rem"}
                                                    >
                                                        {score.state ===
                                                        "Success"
                                                            ? "🟢"
                                                            : "🔴"}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                </Box>
                                <Box textAlign={"center"}>
                                    {/*<Typography*/}
                                    {/*    color={"white"}*/}
                                    {/*    fontFamily={"BebasNeue"}*/}
                                    {/*    fontSize={"1.6rem"}*/}
                                    {/*    lineHeight={"2rem"}*/}
                                    {/*>*/}
                                    {/*    Current try*/}
                                    {/*</Typography>*/}
                                    <Typography
                                        color={"white"}
                                        fontFamily={"BebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        {athleteWeightInfo.scores?.find(
                                            (score) =>
                                                score.state === "Try" &&
                                                score.partnerId ===
                                                    (!!currentIndex ? 1 : 0)
                                        )?.weight || "-"}{" "}
                                        kg
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                </Box>
            )}

            <Stack height={1} justifyContent={"space-between"} my={0} py={0}>
                <Box
                    height={HEADER_HEIGHT}
                    sx={{
                        background:
                            "linear-gradient(45deg, rgba(245,14,47,1) 0%, rgba(245,14,47,1) 16%,#fff 16%,#fff 17%, #393873 17%, #393873 55%, #39387300 55%),linear-gradient(135deg, #39387300 45%, #393873 45%,#393873 83%,#fff 83%, #fff 84%,rgba(245,14,47,1) 84%,rgba(245,14,47,1) 100%)",
                        color: "white",
                    }}
                    display={"flex"}
                    gap={2}
                    position={"relative"}
                >
                    {/*<Box width={10} sx={{backgroundColor:"white", transform:"rotate(-45deg)"}} height={"140%"} position="absolute" left={240} top={-20}></Box>*/}
                    <Box
                        overflow={"hidden"}
                        width={HEADER_HEIGHT + ATHLETE_HEIGHT + 90}
                        height={HEADER_HEIGHT + ATHLETE_HEIGHT + 90}
                        position={"absolute"}
                        borderRadius={"10px"}
                        sx={{ transform: "translateX(-50%)" }}
                        left={"50vw"}
                        top={-22}
                    >
                        <Image
                            src={logoUrl}
                            layout={"fill"}
                            objectFit="contain"
                        />
                    </Box>

                    <Box flexGrow={1} display={"flex"} height={1}>
                        <Box
                            display={"flex"}
                            width={0.15}
                            sx={{ color: "#393873" }}
                            pl={5}
                        >
                            <Chrono
                                reverse={
                                    workout?.options?.chronoDirection === "desc"
                                }
                                fontSize={"3.5rem"}
                                fontFamily={"BebasNeue"}
                                timeLeftColor={"white"}
                            />
                        </Box>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            width={0.7}
                            gap={26}
                            height={1}
                            px={7}
                        >
                            <Box width={0.5} mx={"auto"}>
                                {workout?.layout === "default" &&
                                    stationsReady?.[0] && (
                                        <AthleteDuel
                                            currentIndex={currentIndex}
                                            dataSource={workout?.dataSource}
                                            switchTime={
                                                +workout.wodIndexSwitchMinute
                                            }
                                            timer={plainTimer}
                                            station={
                                                stationsReady[0] as WidescreenStation
                                            }
                                            workout={workoutFlow}
                                            duration={globals?.duration}
                                            wodWeightData={wodWeightInfo.find(
                                                (data) =>
                                                    data.laneNumber ===
                                                    stationsReady[0].laneNumber
                                            )}
                                        />
                                    )}
                            </Box>
                            <Box width={0.5} mx={"auto="}>
                                {workout?.layout === "default" &&
                                    stationsReady?.[1] && (
                                        <AthleteDuel
                                            reverse
                                            currentIndex={currentIndex}
                                            dataSource={workout?.dataSource}
                                            switchTime={
                                                +workout.wodIndexSwitchMinute
                                            }
                                            timer={plainTimer}
                                            station={
                                                stationsReady[1] as WidescreenStation
                                            }
                                            workout={workoutFlow}
                                            duration={globals?.duration}
                                            wodWeightData={wodWeightInfo.find(
                                                (data) =>
                                                    data.laneNumber ===
                                                    stationsReady[1].laneNumber
                                            )}
                                        />
                                    )}
                            </Box>
                        </Box>
                        <Box
                            display={"flex"}
                            height={HEADER_HEIGHT}
                            width={0.15}
                            sx={{ color: "#393873" }}
                            justifyContent={"flex-end"}
                            pr={5}
                        >
                            <Typography
                                fontFamily={"BebasNeue"}
                                fontSize={"3.5rem"}
                            >
                                {title}
                            </Typography>
                        </Box>
                        {/* <Title {...titles} textTop={"dsqq"} /> */}
                    </Box>
                </Box>
            </Stack>
            {/*<Box*/}
            {/*    // width={90}*/}
            {/*    // height={90}*/}
            {/*    position={"absolute"}*/}
            {/*    bottom={HEADER_HEIGHT / 3}*/}
            {/*    right={0}*/}
            {/*    sx={{ opacity: 0.3 }}*/}
            {/*    // borderRadius={"50%"}*/}

            {/*    // border="2px solid black"*/}
            {/*>*/}
            {/*    <Image*/}
            {/*        width={90}*/}
            {/*        height={90}*/}
            {/*        src="/api/images/tako.png"*/}
            {/*        // layout={"fill"}*/}
            {/*        objectFit="cover"*/}
            {/*    />*/}
            {/*</Box>*/}
        </Box>
    );
};

export default Overlay;
