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
                    >
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
                            {currentMovementReps} / {currentMovementTotalReps}{" "}
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
                    sx={{ color: "white" }}
                >
                    {finishResult
                        ? finishResult.slice(0, finishResult.length - 2)
                        : repsCompleted}
                </Typography>
            </Box>
            {workout?.main.movements.length === 1 && (
                <Box
                    sx={{ color: "red" }}
                    display={"flex"}
                    justifyContent={"space-between"}
                >
                    <Typography>
                        {/*Average pace: {Math.round(globalPace() * 10) / 10} rep /*/}
                        Average pace: {globalPace()} rep / min
                    </Typography>

                    <Typography>
                        {/*Last 3 pace: {Math.round(currentPace * 10) / 10} rep /*/}
                        Last 3 pace: {currentPace} rep / min
                    </Typography>
                </Box>
            )}
        </>
    );
};
