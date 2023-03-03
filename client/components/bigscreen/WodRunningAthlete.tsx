import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useWorkout from "../../hooks/useWorkout";
import { useRouter } from "next/router";

const colors = {
    first: "linear-gradient(45deg,#06943d, #FFD600 )",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const MIN_SIZE = 520;
const FULL_WIDTH = 1920;
const ROUND_WIDTH = 200;

const globalScoreBoxWidth = 150;

const addZero = (x: string | number, n: number) => {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
};

export const toReadableTime = (timestamp: string | number | Date) => {
    const asDate = new Date(timestamp);
    const hours = addZero(asDate.getUTCHours(), 2);
    const minutes = addZero(asDate.getUTCMinutes(), 2);
    const seconds = addZero(asDate.getUTCSeconds(), 2);
    const milli = addZero(asDate.getUTCMilliseconds(), 3);

    return `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds}.${milli}`;
};

const useHRunningBackgroundSize = (
    totalReps: number,
    repsCompleted: number,
    workoutType: "amrap" | "forTime" | "maxWeight" = "forTime",
    repsOfFirst: number,
    finishResult?: string,
    fullWidth: number = FULL_WIDTH
) => {
    if (finishResult) return fullWidth;

    if (!repsCompleted || !totalReps) return MIN_SIZE;


    switch (workoutType) {
        case "forTime":
            return (
                MIN_SIZE + ((fullWidth - MIN_SIZE) * repsCompleted) / totalReps
            );
        case "amrap":
            return (
                MIN_SIZE +
                ((fullWidth - ROUND_WIDTH - MIN_SIZE) * repsCompleted) /
                    repsOfFirst -
                5
            );
        default:
            return fullWidth - ROUND_WIDTH;
    }
};

const WodRunningAthlete = ({
    // participant,
    // laneNumber,
    workout,
    // repsCompleted,
    height,
    rank,
    repsOfFirst,
    // finishResult,
    titleHeight = 0,
    fullWidth = (1920 * 3) / 4,
    // fullWidth = FULL_WIDTH,
    options,
    primaryColor,
    secondaryColor,
    totalReps = 0,
    // currentMovement,
    // currentMovementReps,
    // currentMovementTotalReps,
    // currentRound = 0,
    workoutType,
    station,
    currentIndex,
    dataSource,
}: {
    // participant: string;
    // laneNumber: number;
    // repsCompleted: number;
    workout: WorkoutDescription | undefined;
    height: number;
    rank: number;
    repsOfFirst: number;
    // finishResult?: string;
    titleHeight?: number;
    fullWidth?: number;
    options?: WorkoutOption;
    primaryColor: string;
    secondaryColor: string;
    totalReps?: number;
    // currentMovement?: string;
    // currentMovementReps?: number;
    // currentMovementTotalReps?: number;
    // currentRound?: number;
    workoutType?: "amrap" | "forTime";
    station: WidescreenStation;
    currentIndex: number;
    dataSource: Workout["dataSource"];
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [showMovement, setShowMovement] = useState<boolean>(false);
    const {
        laneNumber,
        participant,
        currentMovement,
        repsOfMovement: currentMovementReps,
        totalRepsOfMovement: currentMovementTotalReps,
    } = station;
    const repsCompleted = station.repsPerBlock?.[currentIndex] || 0; // OK
    const currentRound = station.position.round + 1;

    const finishResult =
        station.result?.replace("|", " | ") ||
        (!station.measurements?.[currentIndex]
            ? undefined
            : station.measurements[currentIndex].method === "time"
            ? toReadableTime(station.measurements[currentIndex].value)
            : `${station.measurements[currentIndex].value?.toString()} reps|`);
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const {
        // totalRepetitions,
        movement,
        movementReps,
        movementTotalReps,
        round,
        // wodType,
    } = useWorkout(workout, repsCompleted);

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

    const bgSize = useHRunningBackgroundSize(
        totalReps,
        repsCompleted,
        workoutType,
        repsOfFirst,
        finishResult,
        fullWidth
    );


    useEffect(() => {
        if (rank > 3 || rank < 1) {
            switch (laneNumber % 2) {
                default:
                    setBg("lightgray");
                    setTextColor("#000");
                    break;
            }
        } else {
            switch (rank) {
                case 1:
                    setBg(
                        `linear-gradient(45deg,${primaryColor}, ${secondaryColor} )`
                    );
                    setTextColor("#000");
                    break;

                // case 2:
                //     setBg(colors.second);
                //     setTextColor("#000");
                //     break;
                // case 3:
                //     setBg(colors.third);
                //     setTextColor("#000");
                //     break;
                default:
                    setBg("lightgray");
                    setTextColor("#000");
                    break;
            }
        }
    }, [rank]);

    useEffect(() => {
        setShowMovement(true);
        setTimeout(() => setShowMovement(false), 4000);
    }, [currentMovement]);

    if (!participant) {
        return <div></div>;
    }

    return (
        <Box display="flex" height={height}>
            <Box
                zIndex={10}
                sx={{
                    // height: (1080 - 155 - titleHeight) / divNumber,
                    color: textColor,
                    justifyContent: "flex-start",
                    display: "flex",
                    // width: "100%",
                    alignItems: "center",
                    position: "relative",
                    paddingY: "5px",
                }}
            >
                {/* <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
                ml={3}
            > */}
                <Box
                    display={"flex"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    px={2}
                    width={bgSize}
                    sx={{
                        borderRadius: "5px",
                        background: bg,
                        transition: "width 0.7s",
                    }}
                    height={"100%"}
                >
                    <Typography
                        component="div"
                        sx={{ fontFamily: "BebasNeue" }}
                        // fontSize={"2.7rem"}
                        fontSize={"3.6rem"}
                    >
                        {laneNumber}
                    </Typography>

                    <Typography
                        component="div"
                        sx={{
                            ml: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "BebasNeue",
                        }}
                        // fontSize={"2.7rem"}
                        fontSize={"3.6rem"}
                        noWrap
                    >
                        {participant.toUpperCase()}
                    </Typography>

                    {finishResult ? (
                        <Typography
                            component="div"
                            sx={{ fontFamily: "CantoraOne" }}
                            fontSize={"3.1rem"}
                            mx={"auto"}
                        >
                            {finishResult.slice(0, finishResult.length - 1)}
                        </Typography>
                    ) : !showMovement ? (
                        <Typography
                            component="div"
                            sx={{ fontFamily: "CantoraOne" }}
                            // fontSize={"2.7rem"}
                            fontSize={"4.7rem"}
                            ml={"auto"}
                        >
                            {/* {repsCompleted - repsOfFirst < 0
                                ? repsCompleted - repsOfFirst
                                : getWorkoutData()?.currentMovementReps} */}
                            {repsCompleted}
                        </Typography>
                    ) : (
                        <Box
                            sx={{ backgroundColor: "#06943d" }}
                            p={0.5}
                            borderRadius="5px"
                            ml={"auto"}
                            display="flex"
                        >
                            <Typography
                                component="div"
                                sx={{ fontFamily: "CantoraOne" }}
                                fontSize={"2rem"}
                                noWrap
                            >
                                {getWorkoutData()?.currentMovementTotalReps}{" "}
                                {getWorkoutData()?.currentMovement}
                            </Typography>
                        </Box>
                    )}
                </Box>
                {/* {showMovement && (
                    <Box
                        sx={{ backgroundColor: "#06943d" }}
                        p={0.5}
                        borderRadius="5px"
                        ml={2}
                        display="flex"
                    >
                        <Typography
                            component="div"
                            sx={{ fontFamily: "CantoraOne" }}
                            fontSize={"2rem"}
                            noWrap
                        >
                            {currentMovementTotalReps} {currentMovement}
                        </Typography>
                    </Box>
                )} */}

                {/* {data.result && data.rank && (
                    <Typography
                        position="absolute"
                        right={50}
                        variant="h3"
                        component="div"
                        sx={{
                            ml: 2,
                            mr: 5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "CantoraOne",
                        }}
                        noWrap
                        width={70}
                        height={70}
                        borderRadius={"50%"}
                        border={"6px solid"}
                        textAlign={"center"}
                        alignItems="center"
                        paddingTop={0.2}
                    >
                        {data.rank[data.rank.length - 1]}
                    </Typography>
                )} */}
                {/* </Box> */}
            </Box>
            {options?.showRounds && workoutType === "amrap" && (
                <Box
                    minWidth={ROUND_WIDTH}
                    width={ROUND_WIDTH}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    ml={"auto"}
                    borderLeft={"3px solid lightgray"}
                >
                    <Typography
                        component="div"
                        sx={{ fontFamily: "CantoraOne" }}
                        fontSize={"2.5rem"}
                        noWrap
                        // mx={2}
                        // ml={"auto"}
                        color="white"
                    >
                        rd: {getWorkoutData()?.currentRound}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default WodRunningAthlete;
