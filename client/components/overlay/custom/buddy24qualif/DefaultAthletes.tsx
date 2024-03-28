import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import { useMemo } from "react";
import useWebappWorkout from "../../../../hooks/useWebappWorkout";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
    station: DisplayFullStation;
    workout: Workout;
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    wodState?: number;
    reverse?: boolean;
}

const DefaultAthletes = ({
    station,
    workout,
    wodState = 2,
    reverse = false,
}: Props) => {
    // const competition = useCompetitionContext();
    const [parent] = useAutoAnimate(/* optional config */);

    const repsCompleted = useMemo(() => {
        return (
            station?.scores?.["wodClassic"]
                ?.filter((score) => score.index === workout.workoutId)
                .reduce((total, rep) => total + rep.rep, 0) || 0
        );
    }, [station?.scores, workout.workoutId]);

    const allRepsCompleted = useMemo(() => {
        return (
            station?.scores?.["wodClassic"].reduce(
                (total, rep) => total + rep.rep,
                0
            ) || 0
        );
    }, [station?.scores]);

    const wodClassicScores = useMemo(() => {
        const scores =
            station?.scores?.["wodClassic"].reduce(
                (total: { [k: string]: number }, rep) => ({
                    ...total,
                    [rep.index]: (total[rep.index] || 0) + rep.rep,
                }),
                {}
            ) || {};

        return Object.entries(scores)
            .map(([part, reps]) => ({
                name: part,
                reps: reps,
            }))
            .sort((a, b) => (a.name < b.name ? -1 : 1));
    }, [station?.scores]);

    const complexScore = [...Array(1).keys()].map((partnerId) => {
        const partnerScore = station?.scores?.wodWeight.filter(
            (score) => score.partnerId === partnerId
        );
        if (!partnerScore || partnerScore.length === 0) return { max: 0 };
        return {
            max:
                partnerScore
                    .filter((score) => score.state === "Success")
                    .sort((a, b) => b.weight - a.weight)[0]?.weight || 0,
            current: partnerScore.find((score) => score.state === "Try"),
        };
    })[0];

    const {
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        finishedMovements,
        undoneMovements,
    } = useWebappWorkout(workout, repsCompleted);

    return (
        <Box width={1} height={1} position={"relative"}>
            <Box
                key={station.laneNumber}
                width={0.94}
                borderRadius={"4px"}
                display={"flex"}
                position={"relative"}
                // overflow={"hidden"}
                justifyContent={"space-between"}
                height={1}
                ml={reverse ? "auto" : 3}
                mr={reverse ? 3 : "auto"}
                // my={-3}

                flexDirection={reverse ? "row-reverse" : "row"}
                ref={parent}
            >
                {workout.layout === "pause" && (
                    <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        flexDirection={reverse ? "row-reverse" : "row"}
                        width={0.78}
                        gap={4}
                        position={"absolute"}
                        top={-20}
                        sx={{ transform: "translateY(-50%)" }}
                    >
                        {wodClassicScores.map((score, index) => (
                            <Box
                                border={"3px solid black"}
                                borderRadius={2}
                                overflow={"hidden"}
                                display={"flex"}
                                alignItems={"center"}
                                // mx={"auto"} c
                                sx={{ backgroundColor: "black" }}
                            >
                                <Box px={2} sx={{ backgroundColor: "white" }}>
                                    <Typography
                                        lineHeight={1.3}
                                        fontWeight={700}
                                        fontSize={"1rem"}
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        Part {index + 1}
                                    </Typography>
                                </Box>
                                <Box px={2} height={1} textAlign={"center"}>
                                    <Typography
                                        lineHeight={1.3}
                                        color={"white"}
                                        fontSize={"1rem"}
                                        fontWeight={700}
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        {score.reps}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                {wodState > 0 &&
                    wodState < 3 &&
                    workout.layout === "maxWeight" && (
                        <Box
                            display={"flex"}
                            flexDirection={reverse ? "row-reverse" : "row"}
                            width={0.78}
                            gap={1}
                            position={"absolute"}
                            sx={{ transform: "translateY(-50%)" }}
                        >
                            <Box
                                border={"3px solid black"}
                                borderRadius={2}
                                overflow={"hidden"}
                                display={"flex"}
                                alignItems={"center"}
                                mx={"auto"}
                                sx={{ backgroundColor: "white" }}
                            >
                                <Box px={2}>
                                    <Typography
                                        lineHeight={1.3}
                                        fontWeight={700}
                                        fontSize={"1.3rem"}
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        Current try
                                    </Typography>
                                </Box>
                                <Box
                                    px={2}
                                    sx={{ backgroundColor: "black" }}
                                    height={1}
                                    // width={130}
                                    textAlign={"center"}
                                >
                                    <Typography
                                        lineHeight={1.3}
                                        color={"white"}
                                        fontSize={"1.3rem"}
                                        fontWeight={700}
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        {complexScore.current?.weight
                                            ? `${complexScore.current?.weight} kg`
                                            : "-"}{" "}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                {wodState > 0 && workout.layout === "default" && (
                    <Box
                        display={"flex"}
                        flexDirection={reverse ? "row-reverse" : "row"}
                        width={0.7}
                        gap={1}
                        position={"absolute"}
                        sx={{ transform: "translateY(-50%)" }}
                    >
                        {finishedMovements.map((m, index) => (
                            <Box
                                key={index}
                                border={"2px solid black"}
                                borderRadius={2}
                                overflow={"hidden"}
                                display={"flex"}
                            >
                                <Box
                                    alignItems={"center"}
                                    px={0.5}
                                    sx={{
                                        backgroundColor:
                                            // "rgba(120,120,120,0.92)",
                                            "white",
                                    }}
                                    color={"black"}
                                    display={"flex"}
                                    height={1}
                                    fontSize={"0.8rem"}
                                >
                                    <Typography
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        {m}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ backgroundColor: "black" }}
                                    height={1}
                                    alignItems={"center"}
                                    display={"flex"}
                                    fontSize={"0.8rem"}
                                    px={0.5}
                                >
                                    <Typography color={"white"}>✔</Typography>
                                </Box>
                            </Box>
                        ))}

                        {currentMovement && (
                            <Box
                                border={"3px solid black"}
                                borderRadius={2}
                                overflow={"hidden"}
                                display={"flex"}
                                alignItems={"center"}
                                mx={"auto"}
                                sx={{ backgroundColor: "black" }}
                            >
                                <Box px={2} sx={{ backgroundColor: "white" }}>
                                    <Typography
                                        // lineHeight={1}
                                        // fontWeight={700}
                                        fontSize={"1rem"}
                                        fontFamily={"TacticSansExtExd-BldIt"}
                                    >
                                        {currentMovement}
                                    </Typography>
                                </Box>
                                <Box
                                    px={2}
                                    sx={{ backgroundColor: "black" }}
                                    // height={1}
                                >
                                    <Typography
                                        // py={1}
                                        lineHeight={1.2}
                                        color={"white"}
                                        fontSize={"1rem"}
                                        fontFamily={"TacticSansExtExd-BlkIt"}
                                    >
                                        {currentMovementReps}
                                        {undoneMovements.length
                                            ? ` / ${currentMovementTotalReps}`
                                            : ""}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        {undoneMovements.map((m, index) => (
                            <Box
                                key={index}
                                // border={"2px solid black"}
                                borderRadius={2}
                                overflow={"hidden"}
                                display={"flex"}
                                alignItems={"center"}
                                gap={0.5}
                                px={1}
                                sx={{
                                    backgroundColor: "rgba(195,195,195,0.8)",
                                }}
                                color={"black"}
                            >
                                <Typography
                                    fontFamily={"TacticSansExtExd-BldIt"}
                                    fontSize={"0.8rem"}
                                >
                                    {m}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
                <Box
                    display={"flex"}
                    flexDirection={reverse ? "row-reverse" : "row"}
                    // flexDirection={"column"}
                    // justifyContent={"center"}
                    width={1}
                    maxHeight={1}
                    pt={2}
                    pl={reverse ? 2 : 6}
                    pr={reverse ? 6 : 2}
                    alignItems={"center"}
                    // justifyContent={"space-between"}
                >
                    <Box
                        display={"flex"}
                        gap={2}
                        ml={reverse ? "auto" : 0}
                        mr={reverse ? 0 : "auto"}
                    >
                        <Typography
                            // lineHeight={1.5}
                            fontSize={"1.5rem"}
                            // fontWeight={500}
                            fontFamily={"TacticSansExtExd-BldIt"}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            maxWidth={"100%"}
                            noWrap
                            textAlign={reverse ? "end" : "start"}
                            color={"black"}
                            // sx={{
                            //     textShadow:
                            //         "3px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000, 2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000",
                            // }}
                        >
                            {/*{station.participant.slice(0, 40).toUpperCase()}*/}
                            {station.participant.split(" ")[1].toUpperCase()}
                        </Typography>
                        <Typography
                            // lineHeight={1.5}
                            fontSize={"1.5rem"}
                            fontFamily={"TacticSansExtExd-BlkIt"}
                            // fontWeight={500}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            maxWidth={"100%"}
                            noWrap
                            textAlign={reverse ? "end" : "start"}
                            color={"black"}
                            // sx={{
                            //     textShadow:
                            //         "3px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000, 2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000",
                            // }}
                        >
                            {/*{station.participant.slice(0, 40).toUpperCase()}*/}
                            {station.participant.split(" ")[2].toUpperCase()}
                        </Typography>
                    </Box>
                    {wodState > 0 && (
                        <>
                            {(workout.layout === "default" ||
                                wodState === 3) && (
                                <Box
                                    display={"flex"}
                                    justifyContent={"flex-end"}
                                    mr={reverse ? "" : 9}
                                    ml={reverse ? 9 : ""}
                                >
                                    <Box
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        flexDirection={"column"}
                                        mt={1}
                                    >
                                        <Typography
                                            px={1}
                                            color={"white"}
                                            fontSize={"2.3rem"}
                                            fontFamily={
                                                "TacticSansExtExd-BlkIt"
                                            }
                                            borderRadius={"10px"}
                                            fontWeight={"bold"}
                                            lineHeight={1}
                                            sx={{
                                                textShadow:
                                                    "2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000",
                                            }}
                                        >
                                            {wodState === 3
                                                ? allRepsCompleted
                                                : repsCompleted}
                                        </Typography>
                                        <Typography
                                            px={1}
                                            // color={"white"}
                                            fontSize={"0.8rem"}
                                            // fontFamily={"bebasNeue"}
                                            fontFamily={
                                                "TacticSansExtExd-BlkIt"
                                            }
                                            borderRadius={"10px"}
                                            fontWeight={"bold"}
                                            // sx={{
                                            //     textShadow:
                                            //         "3px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000, 2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000",
                                            // }}
                                        >
                                            {wodState === 3
                                                ? "SCORE A"
                                                : "CURRENT"}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            <Box
                                display={"flex"}
                                justifyContent={
                                    reverse ? "flex-start" : "flex-end"
                                }
                            >
                                <Box
                                    display={"flex"}
                                    width={150}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    flexDirection={"column"}
                                    mt={1}
                                >
                                    <Typography
                                        px={1}
                                        color={"white"}
                                        fontSize={"2.3rem"}
                                        fontFamily={"TacticSansExtExd-BlkIt"}
                                        borderRadius={"10px"}
                                        fontWeight={"bold"}
                                        lineHeight={1}
                                        sx={{
                                            textShadow:
                                                "2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000",
                                        }}
                                    >
                                        {["default", "pause"].includes(
                                            workout.layout!
                                        )
                                            ? allRepsCompleted
                                            : complexScore.max}
                                    </Typography>
                                    <Typography
                                        px={1}
                                        // color={"white"}
                                        fontSize={"0.8rem"}
                                        fontFamily={"TacticSansExtExd-BlkIt"}
                                        borderRadius={"10px"}
                                        fontWeight={"bold"}
                                        // sx={{
                                        //     textShadow:
                                        //         "3px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000, 2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000",
                                        // }}
                                    >
                                        SCORE{" "}
                                        {["default", "pause"].includes(
                                            workout.layout!
                                        )
                                            ? "A"
                                            : "B"}
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DefaultAthletes;
