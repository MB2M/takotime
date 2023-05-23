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

export const AthleteDuelMT: React.FC<Props> = ({
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

    const scoreA =
        (station?.repsPerBlock?.[1] || 0) + (station?.repsPerBlock?.[2] || 0);

    const bestWeightScoreP1 = wodWeightData?.scores
        ?.filter((score) => score.state === "Success" && score.partnerId === 0)
        ?.sort((a, b) => b.weight - a.weight)[0];

    const bestWeightScoreP2 = wodWeightData?.scores
        ?.filter((score) => score.state === "Success" && score.partnerId === 1)
        ?.sort((a, b) => b.weight - a.weight)[0];

    const scoreB =
        (bestWeightScoreP1?.weight || 0) + (bestWeightScoreP2?.weight || 0);

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
                // justifyContent={"space-between"}
                gap={4}
                flexDirection={reverse ? "row-reverse" : "row"}
                textAlign={reverse ? "end" : "start"}
                fontFamily={"BebasNeue"}
                alignItems={"center"}
                height={1}
            >
                <Box>
                    {station.participant.split("/").map((athlete) => (
                        <Typography
                            key={athlete}
                            fontSize={"2rem"}
                            lineHeight={"2rem"}
                            fontFamily={"BebasNeue"}
                            sx={{ color: "white" }}
                            noWrap
                        >
                            {athlete.toUpperCase()}
                        </Typography>
                    ))}
                </Box>

                {/*{!finishResult && (*/}
                {/*    <Box*/}
                {/*        mr={reverse ? "" : "auto"}*/}
                {/*        ml={reverse ? "auto" : ""}*/}
                {/*        textAlign={reverse ? "end" : "start"}*/}
                {/*        height={1}*/}
                {/*        py={1}*/}
                {/*    >*/}
                {/*        {currentIndex === 0 ? (*/}
                {/*            <>*/}
                {/*                {workout?.type === "amrap" && (*/}
                {/*                    <Typography*/}
                {/*                        fontSize={"1.8rem"}*/}
                {/*                        lineHeight={"1.8rem"}*/}
                {/*                        fontFamily={"BebasNeue"}*/}
                {/*                        sx={{ color: "#023A59" }}*/}
                {/*                    >*/}
                {/*                        Round-{currentRound}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*                <Typography*/}
                {/*                    fontSize={"1.5rem"}*/}
                {/*                    lineHeight={"1.3rem"}*/}
                {/*                    fontFamily={"BebasNeue"}*/}
                {/*                    sx={{ color: "#023A59" }}*/}
                {/*                    noWrap*/}
                {/*                    // maxWidth={60}*/}
                {/*                >*/}
                {/*                    {currentMovementReps} /{" "}*/}
                {/*                    {currentMovementTotalReps}{" "}*/}
                {/*                </Typography>*/}
                {/*                <Typography*/}
                {/*                    fontSize={"1.3rem"}*/}
                {/*                    lineHeight={"1.3rem"}*/}
                {/*                    fontFamily={"BebasNeue"}*/}
                {/*                    sx={{ color: "#023A59" }}*/}
                {/*                    noWrap*/}
                {/*                >*/}
                {/*                    {currentMovement}*/}
                {/*                </Typography>*/}
                {/*            </>*/}
                {/*        ) : (*/}
                {/*            <Box*/}
                {/*                display={"flex"}*/}
                {/*                flexDirection={"column"}*/}
                {/*                justifyContent={"space-between"}*/}
                {/*            >*/}
                {/*                <Box*/}
                {/*                    display={"flex"}*/}
                {/*                    flexDirection={*/}
                {/*                        reverse ? "row-reverse" : "row"*/}
                {/*                    }*/}
                {/*                    gap={3}*/}
                {/*                    // alignItems={"center"}*/}
                {/*                >*/}
                {/*                    /!*<Typography*!/*/}
                {/*                    /!*    py={0}*!/*/}
                {/*                    /!*    fontSize={"1.2rem"}*!/*/}
                {/*                    /!*    fontFamily={"BebasNeue"}*!/*/}
                {/*                    /!*>*!/*/}
                {/*                    /!*    Average*!/*/}
                {/*                    /!*</Typography>*!/*/}
                {/*                    <Box*/}
                {/*                        display={"flex"}*/}
                {/*                        flexDirection={"column"}*/}
                {/*                        alignItems={"center"}*/}
                {/*                        height={1}*/}
                {/*                        py={1}*/}
                {/*                        px={2}*/}
                {/*                    >*/}
                {/*                        <Typography*/}
                {/*                            fontSize={"2.6rem"}*/}
                {/*                            lineHeight={"1.8rem"}*/}
                {/*                            fontFamily={"BebasNeue"}*/}
                {/*                        >*/}
                {/*                            {`${Math.floor(globalPace())}` ||*/}
                {/*                                "-"}*/}
                {/*                        </Typography>*/}
                {/*                        <Typography*/}
                {/*                            fontSize={"1.1rem"}*/}
                {/*                            lineHeight={"1.8rem"}*/}
                {/*                            fontFamily={"BebasNeue"}*/}
                {/*                        >*/}
                {/*                            reps / min*/}
                {/*                        </Typography>*/}
                {/*                    </Box>*/}
                {/*                    /!*<Box*!/*/}
                {/*                    /!*    display={"flex"}*!/*/}
                {/*                    /!*    flexDirection={"column"}*!/*/}
                {/*                    /!*    alignItems={"center"}*!/*/}
                {/*                    /!*>*!/*/}
                {/*                    /!*    <Typography*!/*/}
                {/*                    /!*        fontSize={"1.2rem"}*!/*/}
                {/*                    /!*        fontFamily={"BebasNeue"}*!/*/}
                {/*                    /!*    >*!/*/}
                {/*                    /!*        Current*!/*/}
                {/*                    /!*    </Typography>*!/*/}
                {/*                    /!*    <Typography*!/*/}
                {/*                    /!*        fontSize={"1.9rem"}*!/*/}
                {/*                    /!*        lineHeight={"1.8rem"}*!/*/}
                {/*                    /!*        fontFamily={"BebasNeue"}*!/*/}
                {/*                    /!*    >*!/*/}
                {/*                    /!*        {Math.floor(currentPace) || "-"}*!/*/}
                {/*                    /!*    </Typography>*!/*/}
                {/*                    /!*</Box>*!/*/}
                {/*                    /!*<Box*!/*/}
                {/*                    /!*    display={"flex"}*!/*/}
                {/*                    /!*    justifyContent={"center"}*!/*/}
                {/*                    /!*>*!/*/}
                {/*                    /!*    <Typography*!/*/}
                {/*                    /!*        fontSize={"1rem"}*!/*/}
                {/*                    /!*        lineHeight={"0.9rem"}*!/*/}
                {/*                    /!*    >*!/*/}
                {/*                    /!*        reps / min*!/*/}
                {/*                    /!*    </Typography>*!/*/}
                {/*                    /!*</Box>*!/*/}
                {/*                </Box>*/}
                {/*            </Box>*/}
                {/*        )}*/}
                {/*    </Box>*/}
                {/*)}*/}
                <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    gap={4}
                    flexDirection={reverse ? "row-reverse" : "row"}
                    textAlign={reverse ? "end" : "start"}
                    fontFamily={"BebasNeue"}
                    alignItems={"center"}
                    height={1}
                    width={0.62}
                >
                    <Box
                        display={"flex"}
                        gap={2}
                        alignItems={"center"}
                        sx={{ color: "#023A59" }}
                    >
                        <Typography
                            fontSize={"2rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"2rem"}
                        >
                            A:
                        </Typography>
                        <Typography
                            fontSize={"3rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"3rem"}
                        >
                            {scoreA}
                        </Typography>
                        <Typography
                            fontSize={"3rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"3rem"}
                        >
                            Reps
                        </Typography>
                    </Box>
                    <Box
                        display={"flex"}
                        gap={2}
                        alignItems={"center"}
                        sx={{ color: "#023A59" }}
                    >
                        <Typography
                            fontSize={"2rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"2rem"}
                        >
                            B:
                        </Typography>
                        <Typography
                            fontSize={"3rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"3rem"}
                            sx={{ color: "#023A59" }}
                        >
                            {scoreB}
                        </Typography>
                        <Typography
                            fontSize={"3rem"}
                            fontFamily={"BebasNeue"}
                            lineHeight={"3rem"}
                        >
                            Kg
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
