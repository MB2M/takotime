import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import MaxTonnage from "../components/bigscreen/MaxTonnage";
import WodRunningAthlete, {
    toReadableTime,
} from "../components/bigscreen/WodRunningAthlete";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import { workouts } from "../eventConfig/massilia_contest_3/config";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import useInterval from "../hooks/useInterval";
import useStationPayload from "../hooks/useStationPayload";
import Logo from "../components/bigscreen/Logo";
import Image from "next/image";
import Title from "../components/bigscreen/Title";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";
import { useRouter } from "next/router";
import Chrono from "../components/bigscreen/Chrono";
import Athlete from "../components/overlay/Athlete";

const HEADER_HEIGHT = 120;

const BigScreen = () => {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const competition = useCompetitionContext();
    const { heats } = useCompetitionCornerContext();
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

    const chrono = useChrono(globals?.startTime, globals?.duration);

    const currentIndex = useMemo(
        () =>
            workout?.wodIndexSwitchMinute === 0
                ? 0
                : Number(chrono?.toString().replaceAll(":", "")) <
                  (workout?.wodIndexSwitchMinute || 0) * 100000
                ? 0
                : 1,
        [chrono, workout?.wodIndexSwitchMinute]
    );
    const totalReps = useMemo(
        () =>
            loadedWorkouts?.[0]?.blocks[currentIndex]?.measurements?.repsTot ||
            0,
        [currentIndex, loadedWorkouts]
    );

    const workoutType = useMemo(
        () => loadedWorkouts?.[0]?.scoring[currentIndex]?.method || "forTime",
        [currentIndex, loadedWorkouts]
    );

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

    // const heat = useMemo(
    //     () => heats.find((heat) => heat.id === globals?.externalHeatId),
    //     [heats, globals]
    // );

    // const titles = useMemo(() => {
    //     if (!workout?.options?.title) return { textTop: "", textBottom: "" };
    //     switch (workout?.options?.titleType) {
    //         case "category":
    //             return {
    //                 textTop: heat?.divisions.join(" / "),
    //             };

    //         case "heat":
    //             return { textTop: heat?.title };

    //         case "category-heat":
    //             return {
    //                 textTop: heat?.divisions.join(" / "),
    //                 textBottom: heat?.title,
    //             };

    //         case "heat-category":
    //             return {
    //                 textTop: heat?.title,
    //                 textBottom: heat?.divisions.join(" / "),
    //             };
    //         default:
    //             return { textTop: "", textBottom: "" };
    //     }
    // }, [heat, workout?.options?.titleType, workout?.options?.title]);

    return (
        <Box
            height={HEADER_HEIGHT}
            sx={{ backgroundColor: "#000000fa", color: "white" }}
            display={"flex"}
            gap={2}
        >
            <Box
                overflow={"hidden"}
                width={HEADER_HEIGHT * 1.2}
                height={HEADER_HEIGHT * 1.2}
                ml={3}
                position={"relative"}
                borderRadius={"10px"}
                boxShadow={"4px 4px 9px black"}
            >
                <Image src={logoUrl} layout={"fill"} objectFit="cover" />
            </Box>

            <Box flexGrow={1} px={2}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontFamily={"CantoraOne"} fontSize={"4rem"}>
                        {title}
                    </Typography>
                    <Chrono
                        reverse={workout?.options?.chronoDirection === "desc"}
                        fontSize="4rem"
                    />
                </Box>
                <Box display="flex" gap={2}>
                    {workout?.layout === "default" &&
                        stationsReady?.slice(0, 6).map((station) => {
                            const repsOfFirst = stationsReady
                                .map(
                                    (station) =>
                                        station.repsPerBlock?.[currentIndex]
                                )
                                .sort((a, b) => b - a)[0];
                            const workoutFlow = workouts.find(
                                (workout) =>
                                    workout.workoutIds.includes(
                                        globals?.externalWorkoutId.toString() ||
                                            ""
                                    ) && workout.index === currentIndex
                            );

                            const rank =
                                [
                                    ...new Set(
                                        stationsReady
                                            .filter(
                                                (sR) =>
                                                    sR.category ===
                                                    station.category
                                            )
                                            .map(
                                                (stationFiltered) =>
                                                    stationFiltered.rank[
                                                        currentIndex
                                                    ]
                                            )
                                    ),
                                ]
                                    .sort((a, b) => a - b)
                                    .findIndex(
                                        (rank) =>
                                            rank === station.rank[currentIndex]
                                    ) + 1;

                            return (
                                <Athlete
                                    key={station.laneNumber}
                                    workout={workoutFlow}
                                    rank={rank}
                                    repsOfFirst={repsOfFirst}
                                    station={station}
                                    currentIndex={currentIndex}
                                    dataSource={workout?.dataSource}
                                />
                                // <Box>
                                //     <Box
                                //         width={260}
                                //         p={0.5}
                                //         sx={{
                                //             backgroundColor: "#eee",
                                //             color: "black",
                                //         }}
                                //         boxShadow={"4px 4px 9px "}
                                //         borderRadius={1}
                                //         display={"flex"}
                                //         alignItems={"center"}
                                //         gap={1}
                                //     >
                                //         <Typography
                                //             width={0.06}
                                //             fontSize={"1.5rem"}
                                //             sx={{ backgroundColor: "#fff" }}
                                //         >
                                //             {rank}
                                //         </Typography>
                                //         <Typography
                                //             width={0.8}
                                //             fontSize={"1.5rem"}
                                //             lineHeight={0.8}
                                //         >
                                //             {station.participant}
                                //         </Typography>
                                //         {
                                //             <Typography
                                //                 fontSize={"1.2rem"}
                                //                 lineHeight={0.8}
                                //                 ml={"auto"}
                                //                 textAlign={"end"}
                                //             >
                                //                 {finishResult
                                //                     ? finishResult.slice(
                                //                           0,
                                //                           finishResult.length -
                                //                               1
                                //                       )
                                //                     : rank > 1
                                //                     ? repsCompleted -
                                //                       repsOfFirst
                                //                     : ""}
                                //             </Typography>
                                //         }
                                //     </Box>

                                //     <Box
                                //         borderRadius={"0px 0px 50px 10px"}
                                //         px={0.5}
                                //         width={250}
                                //         boxShadow={"4px 4px 9px black"}
                                //         mx="auto"
                                //         sx={{ backgroundColor: "#505050" }}
                                //     >
                                //         <Typography color={"white"}>
                                //             {station.repsOfMovement} /{" "}
                                //             {station.totalRepsOfMovement}{" "}
                                //             {station.currentMovement}
                                //         </Typography>
                                //     </Box>
                                // </Box>
                            );
                        })}
                </Box>
                {/* <Title {...titles} textTop={"dsqq"} /> */}
            </Box>
            {/* <Stack overflow={"hidden"} height={1}>
                {workout?.layout === "MaxTonnage" && (
                    <MaxTonnage
                        heatId={globals?.externalHeatId}
                        stations={stations}
                    />
                )}
                {workout?.layout === "default" &&
                    stationsReady?.map((station) => {
                        const repsOfFirst = stationsReady
                            .map(
                                (station) =>
                                    station.repsPerBlock?.[currentIndex]
                            )
                            .sort((a, b) => b - a)[0];
                        const workoutFlow = workouts.find(
                            (workout) =>
                                workout.workoutIds.includes(
                                    globals?.externalWorkoutId.toString() || ""
                                ) && workout.index === currentIndex
                        );
                        return (
                            <WodRunningAthlete
                                key={station.laneNumber} //commun
                                currentIndex={currentIndex}
                                dataSource={workout?.dataSource}
                                station={station}
                                options={workout?.options} //commun
                                workout={workoutFlow}
                                // repsCompleted={s.repsPerBlock?.[currentIndex] || 0} // DIFFERENT
                                // participant={s.participant} //commun
                                totalReps={totalReps} // DIFFERENT
                                // currentMovement={s.currentMovement} // DIFFERENT
                                // currentMovementReps={s.repsOfMovement} // DIFFERENT
                                // currentMovementTotalReps={s.totalRepsOfMovement} // DIFFERENT
                                // currentRound={s.position.round + 1} // DIFFERENT
                                workoutType={workoutType as "amrap" | "forTime"} // DIFFERENT
                                // laneNumber={s.laneNumber} //commun
                                height={1 / stationsReady.length} //commun
                                repsOfFirst={repsOfFirst} //commun
                                // finishResult={
                                //     s.result?.replace("|", " | ") ||
                                //     (!s.measurements?.[currentIndex]
                                //         ? undefined
                                //         : s.measurements[currentIndex].method ===
                                //           "time"
                                //         ? toReadableTime(
                                //               s.measurements[currentIndex].value
                                //           )
                                //         : `${s.measurements[
                                //               currentIndex
                                //           ].value?.toString()} reps|`)
                                // }
                                primaryColor={
                                    competition?.primaryColor || "white"
                                } //commun
                                secondaryColor={
                                    competition?.secondaryColor || "white"
                                } //commun
                                rank={
                                    stationsReady
                                        .filter(
                                            (sR) =>
                                                sR.category === station.category
                                        )
                                        .map(
                                            (stationFiltered) =>
                                                stationFiltered.rank[
                                                    currentIndex
                                                ]
                                        )
                                        .sort((a, b) => a - b)
                                        .findIndex(
                                            (rank) =>
                                                rank ===
                                                station.rank[currentIndex]
                                        ) + 1
                                } // DIFFERENT
                            />
                        );
                    })}
            </Stack> */}
            {/* </Grid> */}

            {/* <Box
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
};

export default BigScreen;
