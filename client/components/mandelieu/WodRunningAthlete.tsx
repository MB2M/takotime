import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useWorkout from "../../hooks/useWorkout";
import { workouts } from "../../pages/mandelieu/workout/config";

const colors = {
    first: "#FFD600",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const MIN_SIZE = 520;
const FULL_WIDTH = 1920;

const globalScoreBoxWidth = 150;

const useHRunningBackgroundSize = (
    totalReps: number,
    repsCompleted: number,
    finishResult?: string
) => {
    if (finishResult) return FULL_WIDTH;

    if (!repsCompleted || !totalReps) return MIN_SIZE;

    return MIN_SIZE + ((FULL_WIDTH - MIN_SIZE) * repsCompleted) / totalReps;
};

const WodRunningAthlete = ({
    participant,
    laneNumber,
    workout,
    repsCompleted,
    divNumber,
    rank,
    repsOfFirst,
}: {
    participant: string;
    laneNumber: number;
    repsCompleted: number;
    workout: WorkoutDescription | undefined;
    divNumber: number;
    rank: number;
    repsOfFirst: number;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [showMovement, setShowMovement] = useState<boolean>(false);
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const {
        totalReps,
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
        currentRound,
        workoutType,
    } = useWorkout(workout, repsCompleted);

    const bgSize = useHRunningBackgroundSize(totalReps, repsCompleted);

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

    useEffect(()=>{
        setShowMovement(true);
        setTimeout(()=>setShowMovement(false), 4000)
    }, [currentMovement])

    if (!participant) {
        return <div></div>;
    }
    return (
        <Box
            zIndex={10}
            sx={{
                height: (1080 - 155) / divNumber,
                color: textColor,
                justifyContent: "flex-start",
                display: "flex",
                width: "100%",
                alignItems: "center",
                position: "relative",
                paddingY: "5px",
                // border: `3px solid ${bg}`,
                borderRadius: "50px 50px 50px 50px",
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
                sx={{ backgroundColor: bg }}
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
                <Typography
                    component="div"
                    sx={{ fontFamily: "CantoraOne" }}
                    fontSize={"2.7rem"}
                    ml={"auto"}
                >
                    {repsCompleted - repsOfFirst
                        ? repsCompleted - repsOfFirst
                        : ""}
                </Typography>
            </Box>
            {showMovement && (
                <Box
                    sx={{ backgroundColor: "#06943d" }}
                    p={0.5}
                    borderRadius="5px"
                    ml={2}
                >
                    <Typography
                        component="div"
                        sx={{ fontFamily: "CantoraOne" }}
                        fontSize={"2rem"}
                        noWrap
                    >
                        {currentMovement}
                    </Typography>
                </Box>
            )}

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
    );
};

export default WodRunningAthlete;
