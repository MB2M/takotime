import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import MaxTonnage from "../components/bigscreen/MaxTonnage";
// import WodRunningAthlete from "../components/bigscreen/WodRunningAthlete";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
// import { workouts } from "../eventConfig/cannesBirthday/config";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import { useRouter } from "next/router";
import DefaultLayout from "../components/bigscreen/Layouts/default/DefaultLayout";
import useStationWs from "../hooks/bigscreen/useStationWs";
import Default2ScoresLayout from "../components/bigscreen/Layouts/default/Default2ScoresLayout";

const HEADER_HEIGHT = 100;

const BigScreen = () => {
    const competition = useCompetitionContext();
    const { globals, stations, sendMessage, registerListener } =
        useLiveDataContext();
    const { timer, plainTimer } = useChrono(
        globals?.startTime,
        globals?.duration
    );

    const { fullStations, workout, workouts } = useStationWs();

    // const workouts = useMemo(
    //     () =>
    //         competition?.workouts?.filter(
    //             (workout) =>
    //                 workout.linkedWorkoutId ===
    //                 globals?.externalWorkoutId.toString()
    //         ) || [],
    //     [competition?.workouts, globals?.externalWorkoutId]
    // );

    // const workout = workouts
    //     .sort((a, b) => a.wodIndexSwitchMinute - b.wodIndexSwitchMinute)
    //     .findLast(
    //         (workout) => workout.wodIndexSwitchMinute * 10000 <= plainTimer
    //     );

    // const [stationsInfo, setStationsInfo] = useState<BaseStation[]>([]);

    // const stationsUpgraded = useStationPayload(stations, ranks);

    const router = useRouter();
    const title = router.query.title as string | undefined;

    // const currentIndex = useMemo(() => {
    //     const switchMinutes = (workout?.wodIndexSwitchMinute || 0)
    //         .toString()
    //         .split(",");
    //     return switchMinutes.findLastIndex(
    //         (minute) => +minute * 100000 > plainTimer
    //     );
    // }, [timer, workout?.wodIndexSwitchMinute]);

    // const currentIndex = useMemo(
    //     () =>
    //         workout?.wodIndexSwitchMinute === 0
    //             ? 0
    //             : plainTimer < (workout?.wodIndexSwitchMinute || 0) * 100000
    //             ? 0
    //             : 1,
    //     [timer, workout?.wodIndexSwitchMinute]
    // );
    // const totalReps = useMemo(
    //     () =>
    //         loadedWorkouts?.[0]?.blocks[currentIndex]?.measurements?.repsTot ||
    //         0,
    //     [currentIndex, loadedWorkouts]
    // );

    // const workoutType = useMemo(
    //     () => loadedWorkouts?.[0]?.scoring[currentIndex]?.method || "forTime",
    //     [currentIndex, loadedWorkouts]
    // );

    // const allScores = useMemo(() => {
    //     return [
    //         stationsInfo
    //             .map(
    //                 (station) =>
    //                     station.scores?.find((score) => score.index === 0)
    //                         ?.repCount || 0
    //             )
    //             .sort((a, b) => (b || 0) - (a || 0)),
    //         stationsInfo
    //             .map(
    //                 (station) =>
    //                     station.scores?.find((score) => score.index === 1)
    //                         ?.repCount || 0
    //             )
    //             .sort((a, b) => (b || 0) - (a || 0)),
    //     ];
    // }, [stationsInfo]);

    // const fullStations = useMemo(
    //     () =>
    //         stations.map((stationUp) => {
    //             return {
    //                 ...stationUp,
    //                 repsPerBlock: [
    //                     stationsInfo
    //                         ?.find(
    //                             (station) =>
    //                                 station.laneNumber === stationUp.laneNumber
    //                         )
    //                         ?.scores?.find((score) => score.index === 0)
    //                         ?.repCount || 0,
    //                     stationsInfo
    //                         ?.find(
    //                             (station) =>
    //                                 station.laneNumber === stationUp.laneNumber
    //                         )
    //                         ?.scores?.find((score) => score.index === 1)
    //                         ?.repCount || 0,
    //                 ],
    //                 rank: allScores.map((scoreIndex, i) =>
    //                     scoreIndex.findIndex((score, index) => {
    //                         return (
    //                             score ===
    //                             stationsInfo
    //                                 ?.find(
    //                                     (station) =>
    //                                         station.laneNumber ===
    //                                         stationUp.laneNumber
    //                                 )
    //                                 ?.scores?.find((score) => score.index === i)
    //                                 ?.repCount
    //                         );
    //                     }) === -1
    //                         ? scoreIndex.length + 1
    //                         : scoreIndex.findIndex((score) => {
    //                               return (
    //                                   score ===
    //                                   stationsInfo
    //                                       ?.find(
    //                                           (station) =>
    //                                               station.laneNumber ===
    //                                               stationUp.laneNumber
    //                                       )
    //                                       ?.scores?.find(
    //                                           (score) => score.index === i
    //                                       )?.repCount
    //                               );
    //                           }) + 1
    //                 ),
    //             };
    //         }),
    //     [stationsInfo, allScores]
    // );
    // const stationsReady = useStationReady(
    //     workout?.dataSource,
    //     workout?.options?.rankBy,
    //     currentIndex
    // );

    // const stationsUpgradedRankedScores = useMemo(() => {
    //     return stationsUpgraded
    //         .map((station) => station.rank[station.rank.length - 1])
    //         .sort((a, b) => a - b);
    // }, [stationsUpgraded]);

    // const restrieveWodGymInfo = async () => {
    //     if (!globals?.externalHeatId) return;
    //     try {
    //         const response = await fetch(
    //             `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station?heatId=${globals?.externalHeatId}`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         if (response.ok) {
    //             const json = await response.json();
    //             setStationsInfo(json);
    //         } else {
    //             setStationsInfo([]);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         setStationsInfo([]);
    //     }
    // };

    // useInterval(
    //     () => {
    //         restrieveWodGymInfo();
    //     },
    //     workout?.dataSource === "web" ? 1000 : 0
    // );

    // if (!stationsReady) return null;

    if (!workout) return <div>No workout loaded</div>;

    const getLayoutComponent = (layoutName?: string) => {
        switch (layoutName) {
            case "MaxTonnage":
                return (
                    <MaxTonnage
                        heatId={globals?.externalHeatId}
                        stations={fullStations}
                    />
                );
            case "default2ScoresLayout":
                return (
                    <Default2ScoresLayout
                        workouts={workouts}
                        stations={fullStations}
                    />
                );

            default:
                return (
                    <DefaultLayout workout={workout} stations={fullStations} />
                );
        }
    };

    return (
        <>
            <BigscreenLayout headerHeight={HEADER_HEIGHT} customTitle={title}>
                {/*<Stack overflow={"hidden"} height={1}>*/}
                {getLayoutComponent(workout?.layout)}
                {/*</Stack>*/}
            </BigscreenLayout>
            {globals?.state === 1 && (
                <Box
                    width={1920}
                    height={1080}
                    top={0}
                    position="absolute"
                    sx={{
                        backgroundColor: "#000000bb",
                        backdropFilter: "blur(6px)",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography
                        color={"white"}
                        fontSize={"45rem"}
                        fontFamily={"ChivoMono"}
                    >
                        {timer?.toString().slice(1) || ""}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default BigScreen;
