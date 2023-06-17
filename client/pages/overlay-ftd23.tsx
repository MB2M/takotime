import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useCompetitionContext } from "../context/competition";
import { useLiveDataContext } from "../context/liveData/livedata";
import useStationReady from "../hooks/bigscreen/useStationReady";
import useChrono from "../hooks/useChrono";
import Chrono from "../components/bigscreen/Chrono";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toReadableTime } from "../components/bigscreen/WodRunningAthlete";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";
import ftd23Header from "../public/img/FTD23-header.png";
import Image from "next/image";

const OverlayFTD23 = () => {
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

    const stationsReady = useStationReady(
        workout?.dataSource,
        workout?.options?.rankBy,
        currentIndex
    );

    const currentCCHeat = CCData.heats.find(
        (heat) => heat.id === globals?.externalHeatId
    );

    const getTopScore = (length: number) =>
        CCData.results
            .filter(
                (result) =>
                    result.division === currentCCHeat?.divisions[0] &&
                    result.scores[0]
            )
            ?.sort((a, b) => {
                const scoreA = a?.scores[0] || "0";
                const scoreB = b?.scores[0] || "0";

                if (scoreA.includes("WD") || scoreA === "0") return 1;
                if (scoreB.includes("WD") || scoreB === "0") return -1;
                if (scoreA.includes("Cap+") && scoreB.includes("Cap+"))
                    return (
                        +scoreB.replaceAll("Cap+ ", "") -
                        +scoreA.replaceAll("Cap+", "")
                    );

                if (scoreA.includes("Cap+") && !scoreB.includes("Cap+"))
                    return 1;
                if (!scoreA.includes("Cap+") && scoreB.includes("Cap+"))
                    return -1;

                return +scoreA.replace(":", "") - +scoreB.replace(":", "");
            })
            .slice(0, length);

    return (
        <Box height={1080} overflow={"hidden"} position={"relative"}>
            <Typography
                position={"absolute"}
                top={30}
                right={200}
                zIndex={100}
                color={"#393873"}
                component={"h4"}
                variant={"h4"}
                alignItems={"center"}
                fontFamily={"chakraPetchItalic"}
                fontSize={"2.3rem"}
                fontWeight={"bold"}
                textTransform={"uppercase"}
                width={350}
            >
                EVENT 9 - {currentCCHeat?.title}
            </Typography>
            <Typography
                position={"absolute"}
                top={81}
                right={410}
                zIndex={100}
                color={"white"}
                component={"h4"}
                variant={"h4"}
                alignItems={"center"}
                fontFamily={"Inconsolata"}
                fontSize={"1.5rem"}
                textTransform={"uppercase"}
                fontWeight={"bold"}
            >
                TIME CAP 1 MIN
            </Typography>

            <Box
                position={"absolute"}
                top={70}
                right={314}
                zIndex={100}
                sx={{ color: "white" }}
                fontWeight={"bold"}
                fontSize={"1.5rem"}
            >
                <Chrono
                    reverse={workout?.options?.chronoDirection === "desc"}
                    fontSize={"1.7rem"}
                    timeLeftColor={"white"}
                    fontFamily={"Inconsolata"}
                />
            </Box>

            <Box position={"absolute"} top={26} right={0}>
                <Image src={ftd23Header} alt="FTD23" />
            </Box>

            <Box
                bottom={15}
                position={"absolute"}
                display={"flex"}
                justifyContent={"space-between"}
                textAlign={"center"}
                width={"100%"}
            >
                {stationsReady
                    ?.slice(0, 5)
                    .reverse()
                    .map((station) => {
                        const finishResult =
                            station.result?.replace("|", " | ") ||
                            (!station.measurements?.[currentIndex]
                                ? undefined
                                : station.measurements[currentIndex].method ===
                                  "time"
                                ? toReadableTime(
                                      station.measurements[currentIndex].value
                                  )
                                : `${station.measurements[
                                      currentIndex
                                  ].value?.toString()} reps|`);

                        return (
                            <Box
                                width={1}
                                mx={0.5}
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"space-between"}
                                key={station.laneNumber}
                            >
                                <Box
                                    px={2}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    gap={1}
                                    fontFamily={"BebasNeue"}
                                    sx={{
                                        backgroundColor: "#dd383f",
                                        color: "#f1f1f1",
                                    }}
                                    width={0.8}
                                    ml={"auto"}
                                    mr={2}
                                    boxShadow={
                                        "inset 0px -3px 10px 0 #39387370"
                                    }
                                    ref={parent}
                                >
                                    {finishResult && (
                                        <Typography
                                            fontFamily={"chakraPetchItalic"}
                                            fontSize={"1.5rem"}
                                            fontWeight={"bold"}
                                            textTransform={"uppercase"}
                                        >
                                            {finishResult.includes("CAP")
                                                ? "CAP"
                                                : finishResult.slice(
                                                      0,
                                                      finishResult.length - 2
                                                  )}
                                        </Typography>
                                    )}
                                </Box>

                                <Box
                                    key={station.laneNumber}
                                    pr={2}
                                    pl={1}
                                    // borderRadius={1}
                                    display={"flex"}
                                    alignItems={"center"}
                                    gap={1}
                                    sx={{
                                        backgroundColor: "#393873",
                                        color: "#f1f1f1",
                                    }}
                                    boxShadow={"-5px 5px 0 0px #fff"}
                                    zIndex={10}
                                >
                                    <Box
                                        position={"relative"}
                                        width={35}
                                        top={-8}
                                        sx={{
                                            backgroundColor: "#dd383f",
                                            color: "#f1f1f1",
                                        }}
                                    >
                                        <Typography
                                            fontFamily={"chakraPetchItalic"}
                                            fontSize={"2rem"}
                                            fontWeight={"bold"}
                                        >
                                            {station.laneNumber}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        fontFamily={"Inconsolata"}
                                        fontSize={"1.8rem"}
                                        mx={"auto"}
                                        fontWeight={"bold"}
                                        textTransform={"uppercase"}
                                    >
                                        {station.participant}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
            {getTopScore(1).length > 0 && (
                <Box
                    top={140}
                    right={0}
                    position={"absolute"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    alignItems={"end"}
                    textAlign={"center"}
                    // width={"100%"}
                >
                    <Typography
                        sx={{
                            backgroundColor: "#dd383f",
                            color: "#fff",
                        }}
                        textAlign={"end"}
                        fontFamily={"chakraPetchItalic"}
                        fontSize={"1rem"}
                        position={"absolute"}
                        top={-15}
                        ml={"auto"}
                        px={1}
                    >
                        TIME TO BEAT
                    </Typography>
                    {getTopScore(1).map((result) => (
                        <Box key={result.participantId}>
                            {result.scores[0] && (
                                <Box
                                    px={2}
                                    gap={2}
                                    display={"flex"}
                                    alignItems={"center"}
                                    sx={{
                                        backgroundColor: "#393873",
                                        color: "#fff",
                                    }}
                                    pt={1.4}
                                >
                                    <Typography
                                        fontFamily={"Inconsolata"}
                                        fontSize={"1.5rem"}
                                        fontWeight={"bold"}
                                    >
                                        {result.participant}
                                    </Typography>
                                    <Typography
                                        fontFamily={"chakraPetchItalic"}
                                        ml={"auto"}
                                        fontSize={"1.5rem"}
                                    >
                                        {result.scores[0]}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default OverlayFTD23;
