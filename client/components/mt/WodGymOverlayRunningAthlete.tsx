import { Box, Grid, Stack, Typography } from "@mui/material";
import {
    ReactChild,
    ReactFragment,
    ReactPortal,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

const bgColors = {
    first: "#FFD600",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const WodGymOverlayRunningAthlete = ({
    data,
    wodGymData,
    position,
    heatConfig,
}: {
    data: any;
    wodGymData: any;
    heatConfig: any;
    position: "left" | "right";
}) => {
    const [bg, setBg] = useState<string>("#5C5C5C");
    const [textColor, setTextColor] = useState<string>("white");

    const setupColors = (rank: number) => {
        switch (rank) {
            case 1:
                setBg(bgColors.first);
                setTextColor("black")
                break;
            case 2:
                setBg(bgColors.second);
                setTextColor("white")
                break;
            case 3:
                setBg(bgColors.third);
                setTextColor("white")

                break;
            default:
                setBg(bgColors.other);
                setTextColor("white")
                break;
        }
    };

    useEffect(() => {
        const rank = data.rank;
        if (rank) setupColors(rank);
    }, [data]);

    return (
        <Box
            height={105}
            sx={{
                borderRadius:
                    position === "left" ? "0px 10px 10px 0px" : "10px 0 0 10px",
                overflow: "hidden",
            }}
            display="flex"
            flexDirection={position === "left" ? "row" : "row-reverse"}
        >
            <Grid
                container
                spacing={0}
                direction="column"
                justifyContent="space-between"
                sx={{
                    height: "100%",
                    background: bg,
                    color: textColor,
                }}
            >
                <Grid container item xs={8} direction={`column`} width={280}>
                    <Grid
                        container
                        item
                        // xs={3}
                        direction={`row${
                            position === "left" ? "" : "-reverse"
                        }`}
                        justifyContent="space-between"
                        alignItems={"center"}
                        paddingX={1}
                    >
                        <Grid item>
                            <Typography
                                variant="overline"
                                fontSize={"30px"}
                                sx={{
                                    fontFamily: "CantoraOne",
                                    lineHeight: "0.9",
                                }}
                            >
                                {data.laneNumber}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={6}
                        direction={`row${
                            position === "left" ? "" : "-reverse"
                        }`}
                        justifyContent="space-between"
                        alignItems={"center"}
                        paddingRight={1}
                        paddingLeft={1}
                    >
                        <Grid item marginTop="auto">
                            <Typography
                                variant="h5"
                                maxWidth="240px"
                                textAlign={
                                    position === "left" ? "start" : "end"
                                }
                                sx={{
                                    fontFamily: "CantoraOne",
                                    lineHeight: "0.9",
                                }}
                            >
                                {data.participant.toUpperCase()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    height={30}
                    justifyContent={"space-evenly"}
                >
                    {wodGymData?.scores &&
                        [1, 2, 3].map((roundNumber) => (
                            <Grid item xs={4}>
                                <Typography fontSize={"1.3rem"}>
                                    R{roundNumber}:
                                    {wodGymData.scores.find(
                                        (score: { roundNumber: number }) => {
                                            return (
                                                score.roundNumber ===
                                                roundNumber
                                            );
                                        }
                                    ).gymRepCount *
                                        heatConfig?.rounds?.find(
                                            (round: { roundNumber: number }) =>
                                                round.roundNumber ===
                                                roundNumber
                                        )?.pointsPerMovement || 0}
                                </Typography>
                            </Grid>
                        ))}
                    {/* {wodGymData?.scores && (
                        <Grid item xs={4}>
                            <Typography fontSize={"1.3rem"}>
                                R2:
                                {
                                    wodGymData.scores.find(
                                        (score: { roundNumber: number }) => {
                                            return score.roundNumber === 2;
                                        }
                                    ).gymRepCount
                                }
                            </Typography>
                        </Grid>
                    )} */}
                </Grid>
            </Grid>
            <Box
                width={"130px"}
                sx={{
                    backgroundColor: "#000000c0",
                    color: "white",
                }}
                alignItems="center"
                display="flex"
                justifyContent="center"
            >
                <Typography fontSize={"3rem"}>{data.result}</Typography>
            </Box>
        </Box>
    );
};

export default WodGymOverlayRunningAthlete;
