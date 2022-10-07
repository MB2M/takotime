import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useWorkout from "../../hooks/useWorkout";
import { workouts } from "../../eventConfig/mandelieu/config";

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

const useHRunningBackgroundSize = (
    totalReps: number,
    repsCompleted: number,
    workoutType: "amrap" | "forTime" | "maxWeight" = "forTime",
    repsOfFirst: number,
    finishResult?: string,
    fullWidth: number = 1920,
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
                    repsOfFirst
            );
        default:
            return fullWidth - ROUND_WIDTH;
    }
};

const WodRunningAthlete = ({
    participant,
    laneNumber,
    workout,
    repsCompleted,
    divNumber,
    rank,
    repsOfFirst,
    finishResult,
    titleHeight = 0,
    fullWidth = 1920,
}: {
    participant: string;
    laneNumber: number;
    repsCompleted: number;
    workout: WorkoutDescription | undefined;
    divNumber: number;
    rank: number;
    repsOfFirst: number;
    finishResult?: string;
    titleHeight?: number;
    fullWidth?: number;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [showMovement, setShowMovement] = useState<boolean>(false);
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const {
        totalRepetitions: totalReps,
        movement: currentMovement,
        movementReps: currentMovementReps,
        movementTotalReps: currentMovementTotalReps,
        round: currentRound,
        wodType: workoutType,
    } = useWorkout(workout, repsCompleted);

    const bgSize = useHRunningBackgroundSize(
        totalReps,
        repsCompleted,
        workoutType,
        repsOfFirst,
        finishResult,
        fullWidth
    );

    // const [rank, setRank] = useState<number | undefined>();

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
                    setBg(colors.first);
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
        <Box display="flex">
            <Box
                zIndex={10}
                sx={{
                    height: (1080 - 155 - titleHeight) / divNumber,
                    color: textColor,
                    justifyContent: "flex-start",
                    display: "flex",
                    width: "100%",
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
                        sx={{ fontFamily: "CantoraOne" }}
                        fontSize={"2.7rem"}
                    >
                        {laneNumber}
                    </Typography>

                    <Typography
                        component="div"
                        sx={{
                            ml: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "CantoraOne",
                        }}
                        fontSize={"2.7rem"}
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
                            fontSize={"2.7rem"}
                            ml={"auto"}
                        >
                            {repsCompleted - repsOfFirst
                                ? repsCompleted - repsOfFirst
                                : currentMovementReps}
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
                                {currentMovementTotalReps} {currentMovement}
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
            {workoutType === "amrap" && currentRound > 0 && (
                <Box
                    width={ROUND_WIDTH}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
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
                        rd: {currentRound}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default WodRunningAthlete;
