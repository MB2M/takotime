import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import { workouts } from "../eventConfig/cannesBirthday/config";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import Image from "next/image";
import { useRouter } from "next/router";
import Chrono from "../components/bigscreen/Chrono";
import Athlete from "../components/overlay/Athlete";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const HEADER_HEIGHT = 80;
const ATHLETE_HEIGHT = 2.8 * 16;

const Overlay = () => {
    const [parent] = useAutoAnimate({ duration: 500, easing: "ease-in-out" });
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
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

    const { timer } = useChrono(globals?.startTime, globals?.duration);

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

    const repsOfFirst = useMemo(
        () =>
            stationsReady
                ?.map((station) => station.repsPerBlock?.[currentIndex])
                .sort((a, b) => b - a)[0],
        [stationsReady, currentIndex]
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

    // const mvtsOfFirst = useMemo(
    //     () =>
    //         stationsReady
    //             ?.map((station) => station.repsPerBlock?.[currentIndex])
    //             .sort((a, b) => b - a)[0],
    //     []
    // );

    const workoutDescription = useMemo(() => {
        if (!workoutFlow?.main.movements) return;
        const movements: string[] = [];
        for (let i = 0; i < workoutFlow.main.movements.length; i++) {
            movements.push(
                `${workoutFlow.main.reps[i]} ${workoutFlow.main.movements[i]}`
            );
        }
        return movements.join(" - ");
    }, [workoutFlow]);

    // const { movement, movementTotalReps } = useWorkout(
    //     workoutFlow,
    //     repsOfFirst || 0
    // );

    return (
        <Box height={1080} overflow={"hidden"}>
            <Stack height={1} justifyContent={"space-between"} my={0} py={0}>
                <Box
                    height={HEADER_HEIGHT}
                    sx={{ backgroundColor: "#000000fa", color: "white" }}
                    display={"flex"}
                    gap={2}
                >
                    <Box
                        overflow={"hidden"}
                        width={HEADER_HEIGHT + ATHLETE_HEIGHT}
                        height={HEADER_HEIGHT + ATHLETE_HEIGHT}
                        ml={3}
                        mt={1}
                        position={"relative"}
                        borderRadius={"10px"}
                        boxShadow={"4px 4px 9px black"}
                    >
                        <Image
                            src={logoUrl}
                            layout={"fill"}
                            objectFit="cover"
                        />
                    </Box>

                    <Box flexGrow={1} px={2}>
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            height={HEADER_HEIGHT}
                        >
                            <Typography
                                fontFamily={"Montserrat"}
                                fontSize={"2.5rem"}
                            >
                                {title}
                            </Typography>
                            <Chrono
                                reverse={
                                    workout?.options?.chronoDirection === "desc"
                                }
                                fontSize={"2.5rem"}
                            />
                        </Box>

                        <Box display="flex" gap={2} ref={parent}>
                            {workout?.layout === "default" &&
                                stationsReady?.slice(0, 6).map((station) => {
                                    // const repsOfFirst = stationsReady
                                    //     .map(
                                    //         (station) =>
                                    //             station.repsPerBlock?.[
                                    //                 currentIndex
                                    //             ]
                                    //     )
                                    //     .sort((a, b) => b - a)[0];

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
                                                            stationFiltered
                                                                .rank[
                                                                currentIndex
                                                            ]
                                                    )
                                            ),
                                        ]
                                            .sort((a, b) => a - b)
                                            .findIndex(
                                                (rank) =>
                                                    rank ===
                                                    station.rank[currentIndex]
                                            ) + 1;

                                    return (
                                        <Box
                                            position={"relative"}
                                            top={-ATHLETE_HEIGHT / 2}
                                            key={station.laneNumber}
                                        >
                                            <Athlete
                                                key={station.laneNumber}
                                                height={ATHLETE_HEIGHT}
                                                workout={workoutFlow}
                                                rank={rank}
                                                repsOfFirst={repsOfFirst}
                                                station={
                                                    station as WidescreenStation
                                                }
                                                currentIndex={currentIndex}
                                                dataSource={workout?.dataSource}
                                            />
                                        </Box>
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
                                        //                           0,"6rem"
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
                <Box
                    height={HEADER_HEIGHT / 3}
                    sx={{ backgroundColor: "#000000fa", color: "white" }}
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={2}
                >
                    <Typography fontSize={"1.3rem"} px={2}>
                        {workoutDescription}
                    </Typography>
                </Box>
            </Stack>
            <Box
                // width={90}
                // height={90}
                position={"absolute"}
                bottom={HEADER_HEIGHT / 3}
                right={0}
                sx={{ opacity: 0.3 }}
                // borderRadius={"50%"}

                // border="2px solid black"
            >
                <Image
                    width={90}
                    height={90}
                    src="/api/images/tako.png"
                    // layout={"fill"}
                    objectFit="cover"
                />
            </Box>
        </Box>
    );
};

export default Overlay;
