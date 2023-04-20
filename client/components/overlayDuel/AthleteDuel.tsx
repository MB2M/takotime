import { Box, Typography } from "@mui/material";
import React from "react";
import useWorkoutData from "../../hooks/useWorkoutData";
import useFinishResult from "../../hooks/useFinishResult";

interface Props {
    reverse?: boolean;
    workout: WorkoutDescription | undefined;
    rank?: number;
    repsOfFirst?: number;
    station: WidescreenStation;
    currentIndex: number;
    dataSource: Workout["dataSource"];
    height?: number | string;
    switchTime?: number;
    timer: number;
    duration?: number;
    wodWeightData?: WodWeightStation;
}

export const AthleteDuel: React.FC<Props> = ({
    reverse = false,
    workout,
    // rank,
    // repsOfFirst,
    station,
    currentIndex,
    dataSource,
    // height,
    switchTime = 0,
    timer,
    duration,
    wodWeightData,
}) => {
    const repsCompleted = station?.repsPerBlock?.[currentIndex] || 0; // OK
    const finishResult = useFinishResult(station, currentIndex);

    const {
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
        currentRound,
    } = useWorkoutData(station, repsCompleted, dataSource, workout);

    const lastRepsTime = station.times?.[currentIndex]?.[0];

    const bestWeightScore = wodWeightData?.scores
        ?.filter(
            (score) =>
                score.state === "Success" &&
                score.partnerId === (!!currentIndex ? 1 : 0)
        )
        ?.sort((a, b) => b.weight - a.weight)[0];

    const globalPace = () => {
        let time: number;

        if (lastRepsTime?.rep === 150) {
            time = lastRepsTime.time;
        } else {
            time = Math.min(timer, (duration || timer) * 60 * 1000);
        }

        return (
            (lastRepsTime?.rep /
                (time / 1000 - (currentIndex ? switchTime : 0) * 60)) *
            60
        );
    };

    const currentPace =
        (Math.min(3, lastRepsTime?.rep) /
            (lastRepsTime?.time -
                (station.times[currentIndex]?.length >= 4
                    ? station.times?.[currentIndex]?.[3].time
                    : currentIndex
                    ? switchTime
                    : 0))) *
        1000 *
        60;

    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"flex-end"}
                gap={4}
                flexDirection={reverse ? "row-reverse" : "row"}
                fontFamily={"BebasNeue"}
                alignItems={"center"}
                height={1}
            >
                {!finishResult && (
                    <Box
                        mr={reverse ? "" : "auto"}
                        ml={reverse ? "auto" : ""}
                        textAlign={reverse ? "end" : "start"}
                        height={1}
                        py={1}
                    >
                        {workout?.name !== "wod3" ? (
                            <>
                                {workout?.type === "amrap" && (
                                    <Typography
                                        fontSize={"1.8rem"}
                                        lineHeight={"1.8rem"}
                                        fontFamily={"BebasNeue"}
                                        sx={{ color: "white" }}
                                    >
                                        Round-{currentRound}
                                    </Typography>
                                )}
                                <Typography
                                    fontSize={"1.5rem"}
                                    lineHeight={"1.3rem"}
                                    fontFamily={"BebasNeue"}
                                    sx={{ color: "white" }}
                                    noWrap
                                    // maxWidth={60}
                                >
                                    {currentMovementReps} /{" "}
                                    {currentMovementTotalReps}{" "}
                                </Typography>
                                <Typography
                                    fontSize={"1.3rem"}
                                    lineHeight={"1.3rem"}
                                    fontFamily={"BebasNeue"}
                                    sx={{ color: "white" }}
                                    noWrap
                                >
                                    {currentMovement}
                                </Typography>
                            </>
                        ) : currentIndex === 1 ? (
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"space-between"}
                            >
                                <Box
                                    display={"flex"}
                                    flexDirection={
                                        reverse ? "row-reverse" : "row"
                                    }
                                    gap={6}
                                >
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                    >
                                        <Typography
                                            fontSize={"1.2rem"}
                                            fontFamily={"BebasNeue"}
                                        >
                                            Average
                                        </Typography>
                                        <Typography
                                            fontSize={"1.9rem"}
                                            lineHeight={"1.8rem"}
                                            fontFamily={"BebasNeue"}
                                        >
                                            {Math.floor(globalPace()) || "-"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                    >
                                        <Typography
                                            fontSize={"1.2rem"}
                                            fontFamily={"BebasNeue"}
                                        >
                                            Current
                                        </Typography>
                                        <Typography
                                            fontSize={"1.9rem"}
                                            lineHeight={"1.8rem"}
                                            fontFamily={"BebasNeue"}
                                        >
                                            {Math.floor(currentPace) || "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} justifyContent={"center"}>
                                    <Typography
                                        fontSize={"0.8rem"}
                                        lineHeight={"0.9rem"}
                                    >
                                        reps / min
                                    </Typography>
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                )}

                <Typography
                    fontSize={"3rem"}
                    lineHeight={"3rem"}
                    fontFamily={"BebasNeue"}
                    sx={{ color: "white" }}
                    noWrap
                >
                    {station.participant?.toUpperCase()}
                </Typography>
                <Typography
                    fontSize={"3rem"}
                    fontFamily={"BebasNeue"}
                    lineHeight={"3rem"}
                    sx={{ color: "white" }}
                >
                    {workout?.name === "wod3" && currentIndex !== 1
                        ? `${bestWeightScore?.weight || 0} kg`
                        : finishResult
                        ? finishResult.slice(0, finishResult.length - 2)
                        : repsCompleted}
                </Typography>
            </Box>
        </>
    );
};
