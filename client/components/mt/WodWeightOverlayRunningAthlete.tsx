import { Box, Grid, Stack, Typography } from "@mui/material";
import {
    ReactChild,
    ReactFragment,
    ReactPortal,
    useEffect,
    useState,
} from "react";

const bgColors = {
    first: "#FFD600",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const WodWeightOverlayRunningAthlete = ({
    data,
    wodWeightData,
    position,
}: {
    data: any;
    wodWeightData: any;
    position: "left" | "right";
}) => {
    const [bg, setBg] = useState("");

    const setupColors = (rank: number) => {
        switch (rank) {
            case 1:
                setBg(bgColors.first);
                break;
            case 2:
                setBg(bgColors.second);
                break;
            case 3:
                setBg(bgColors.third);
                break;
            default:
                setBg(bgColors.other);
                break;
        }
    };

    useEffect(() => {
        const rank = data.rank;
        if (rank) setupColors(rank);
    }, [data]);

    return (
        <Box
            height={80}
            sx={{
                borderRadius:
                    position === "left" ? "0px 10px 10px 0px" : "10px 0 0 10px",
                overflow: "hidden",
            }}
            display="flex"
        >
            <Grid
                container
                spacing={0}
                direction="column"
                justifyContent="space-between"
                sx={{
                    height: "100%",
                    background: "#000000f2",
                    color: "white",
                }}
            >
                <Grid container item xs={10} direction={`column`} width={300}>
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
                        <Grid item>
                            {!data.result ? (
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "CantoraOne",
                                        }}
                                    >
                                        {`${data.totalRepsOfMovement || ""} ${
                                            data.currentMovement || ""
                                        }`}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: "CantoraOne",
                                        }}
                                    >
                                        {data.repsOfMovement
                                            ? ": " + data.repsOfMovement
                                            : ""}
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="flex-end"
                                    spacing={0}
                                    marginRight={1}
                                >
                                    {data.result
                                        .split("|")
                                        .map(
                                            (
                                                r:
                                                    | boolean
                                                    | ReactChild
                                                    | ReactFragment
                                                    | ReactPortal
                                                    | null
                                                    | undefined
                                            ) => (
                                                <Typography
                                                    lineHeight={1.2}
                                                    sx={{
                                                        fontFamily:
                                                            "CantoraOne",
                                                    }}
                                                >
                                                    {r}
                                                </Typography>
                                            )
                                        )}
                                </Stack>
                            )}
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
                        <Grid item>
                            <Typography
                                textAlign={"center"}
                                variant="h5"
                                sx={{
                                    fontFamily: "CantoraOne",
                                }}
                            >
                                {data.rank[data.measurements?.length || 0]}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/* jauge */}
                {/* <Grid item height={7} sx={{ background: bg }}></Grid> */}
            </Grid>
            <Box
                width={"130px"}
                sx={{ backgroundColor: "darkslategray", color:"white"}}
                alignItems="center"
                display="flex"
                justifyContent="center"
            >
                <Typography fontSize={"2rem"}>
                    {
                        wodWeightData?.scores.find(
                            (score: { state: string; }) => score.state === "Try"
                        )?.weight
                    }
                </Typography>
            </Box>
        </Box>
    );
};

export default WodWeightOverlayRunningAthlete;
