import { Box, Typography } from "@mui/material";
import { toReadableTime } from "../bigscreen/WodRunningAthlete";
import useWorkout from "../../hooks/useWorkout";
import { useEffect, useRef, useState } from "react";

const Athlete = ({
    workout,
    rank,
    repsOfFirst,
    station,
    currentIndex,
    dataSource,
    height,
}: {
    workout: WorkoutDescription | undefined;
    rank: number;
    repsOfFirst?: number;
    station: WidescreenStation;
    currentIndex: number;
    dataSource: Workout["dataSource"];
    height: number | string;
}) => {
    const [move, setMove] = useState<boolean>(false);

    const repsCompleted = station.repsPerBlock?.[currentIndex] || 0; // OK
    const finishResult =
        station.result?.replace("|", " | ") ||
        (!station.measurements?.[currentIndex]
            ? undefined
            : station.measurements[currentIndex].method === "time"
            ? toReadableTime(station.measurements[currentIndex].value)
            : `${station.measurements[currentIndex].value?.toString()} reps|`);

    const { movement, movementReps, movementTotalReps, round } = useWorkout(
        workout,
        repsCompleted
    );

    const rankRef = useRef(0);

    useEffect(() => {
        // if (rankRef.current !== rank) {
        //     if (rankRef.current > rank) setMove(true);
        //     rankRef.current = rank;
        //     setTimeout(() => setMove(false), 200);
        // }
    }, [rank]);

    const getWorkoutData = () => {
        switch (dataSource) {
            case "iot":
                return {
                    currentMovement: station.currentMovement,
                    currentMovementReps: station.repsOfMovement,
                    currentMovementTotalReps: station.totalRepsOfMovement,
                    currentRound: station.position.round + 1,
                };
            case "web":
                return {
                    currentMovement: movement,
                    currentMovementReps: movementReps,
                    currentMovementTotalReps: movementTotalReps,
                    currentRound: round,
                };
        }
    };

    return (
        <Box>
            <Box
                width={260}
                height={height}
                p={0.5}
                sx={{
                    backgroundColor: "#eee",
                    color: "black",
                    transition: "1.5s ease",
                }}
                position={"relative"}
                boxShadow={"4px 4px 9px "}
                borderRadius={1}
                display={"flex"}
                // alignItems={"center"}
                gap={1}
                mt={move ? 15 : 0}
                //
            >
                <Typography
                    width={0.06}
                    fontSize={"1.5rem"}
                    height={"2.4rem"}
                    fontFamily={"BebasNeue"}
                    display={"flex"}
                    alignItems={"center"}
                >
                    {rank}
                </Typography>
                <Typography
                    height={"2.4rem"}
                    width={0.75}
                    fontSize={"1.4rem"}
                    lineHeight={"1.2rem"}
                    fontFamily={"BebasNeue"}
                    textOverflow={"ellipsis"}
                    py={"auto"}
                    overflow={"hidden"}
                    display={"flex"}
                    alignItems={
                        station.participant?.length > 24
                            ? "flex-start"
                            : "center"
                    }
                    sx={{ wordBreak: "break-all" }}
                >
                    {station.participant?.toUpperCase()}
                </Typography>
                {
                    <Typography
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"1.5rem"}
                        lineHeight={0.8}
                        ml={"auto"}
                        textAlign={"end"}
                        fontFamily={"BebasNeue"}
                    >
                        {/* {finishResult
                            ? finishResult.slice(0, finishResult.length - 1)
                            : rank > 1
                            ? repsCompleted - Number(repsOfFirst)
                            : ""} */}
                        {finishResult
                            ? finishResult.slice(0, finishResult.length - 1)
                            : repsCompleted}
                    </Typography>
                }
            </Box>

            <Box
                borderRadius={"0px 0px 50px 10px"}
                px={0.5}
                py={0}
                width={250}
                height={"1.8rem"}
                boxShadow={"4px 4px 9px black"}
                mx="auto"
                sx={{ backgroundColor: "#505050" }}
            >
                <Typography
                    color={"white"}
                    alignItems={"flex-end"}
                    display={"flex"}
                    height={1}
                    fontSize={"0.9rem"}
                >
                    {getWorkoutData()?.currentMovementReps} /{" "}
                    {getWorkoutData()?.currentMovementTotalReps}{" "}
                    {getWorkoutData()?.currentMovement}
                </Typography>
            </Box>
        </Box>
    );
};

export default Athlete;
