import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
// import useWorkout from "../../hooks/useWorkout";
// import { workouts } from "../../eventConfig/mandelieu/config";

// const colors = {
//     first: "linear-gradient(45deg,#06943d, #FFD600 )",
//     second: "#05c1de",
//     third: "#fd1085",
//     other: "#5C5C5C",
// };

const MIN_SIZE = 520;
// const FULL_WIDTH = 1920;
const ROUND_WIDTH = 150;

// const globalScoreBoxWidth = 150;

const useHRunningBackgroundSize = (
    score: number,
    scoreOfFirst: number,
    fullWidth: number = 1920
) => {
    if (!score) return MIN_SIZE;

    return (
        MIN_SIZE + ((fullWidth - ROUND_WIDTH - MIN_SIZE) * score) / scoreOfFirst
    );
};

const WodTonnageRunningAthlete = ({
    fullWidth = (1920 * 3) / 4,
    primaryColor,
    secondaryColor,
    height,
    station,
    scoreOfFirst,
}: {
    height: number;
    fullWidth?: number;
    primaryColor: string;
    secondaryColor: string;
    station: Station & {
        result0: WodWeightScore[];
        result1: WodWeightScore[];
        total: number;
    };
    scoreOfFirst: number;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");

    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const bgSize = useHRunningBackgroundSize(
        station.total,
        scoreOfFirst,
        fullWidth
    );

    useEffect(() => {
        switch (scoreOfFirst === station.total) {
            case true:
                setBg(
                    `linear-gradient(45deg,${primaryColor}, ${secondaryColor} )`
                );
                setTextColor("#000");
                break;
            default:
                setBg("lightgray");
                setTextColor("#000");
                break;
        }
    }, [scoreOfFirst, station.total]);

    if (!station.participant) {
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
                        sx={{ fontFamily: "CantoraOne" }}
                        fontSize={"2.7rem"}
                    >
                        {station.laneNumber}
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
                        {station.participant.toUpperCase()}
                    </Typography>

                    {
                        <Typography
                            component="div"
                            sx={{ fontFamily: "CantoraOne" }}
                            fontSize={"2.7rem"}
                            ml={"auto"}
                        >
                            {station.total}
                        </Typography>
                    }
                </Box>
                <Stack height={1} justifyContent="space-evenly">
                    {[station.result0, station.result1].map((result, index) => (
                        <Box display="flex" p={0.5} gap={1}>
                            <Typography color="white">p{index + 1}:</Typography>
                            {result.map((res) => (
                                <Box
                                    width={20}
                                    height={20}
                                    sx={{
                                        backgroundColor:
                                            res.state === "Success"
                                                ? "green"
                                                : "red",
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                </Stack>
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
        </Box>
    );
};

export default WodTonnageRunningAthlete;
