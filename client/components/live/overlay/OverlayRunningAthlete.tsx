import { Box, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MIN_SIZE = 650;
const FULL_WIDTH = 1920;

// linear-gradient(90deg, #3787FF50 0%, #3787FF 99%, rgba(255, 255, 255, 0) 100%)

const bgColors = {
    first: "#FFD600",
    second: "#3787FF",
    third: "#D40000",
    other: "#5C5C5C",
};

// const bgColors = {
//     first: "linear-gradient(90deg, #FFD60070 0%, #FFD600 97%, rgba(255, 255, 255, 0) 97%)",
//     second: "linear-gradient(90deg, #3787FF70 0%, #3787FF 97%, rgba(255, 255, 255, 0) 97%)",
//     third: "linear-gradient(90deg, #D4000070 0%, #D40000 97%, rgba(255, 255, 255, 0) 97%)",
//     other: "linear-gradient(90deg, #5C5C5C 0%, rgba(33, 33, 33, 0.44) 97%, rgba(255, 255, 255, 0) 97%)",
// };

const chevColor = {
    first: "#EECD22",
    second: "#5F9EFF",
    third: "#FF5454",
    other: "#989797",
};

const OverlayRunningAthlete = ({
    data,
    workout,
    position,
}: {
    data: WidescreenStation;
    workout: Workout | undefined;
    position: "left" | "right";
}) => {
    // const [bgColors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [color, setColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [chevronColor, setChevronColor] = useState("");
    const [borders, setBorders] = useState("");
    const [bgSize, setBgSize] = useState(MIN_SIZE);

    const colorOdd = "#747474";
    const colorEven = "#c0c0c0";
    const textColorDefault = "#c0c0c0";

    const getBgSize = () => {
        if (data.result) {
            return 100;
        }

        const totalReps = workout?.blocks.at(-1)?.measurements?.repsTot;
        const currentReps = data.repsPerBlock?.reduce((p, c) => p + c, 0);

        if (!currentReps || !totalReps) return MIN_SIZE;
        console.log(currentReps);
        console.log(totalReps);

        return MIN_SIZE + ((FULL_WIDTH - MIN_SIZE) * currentReps) / totalReps;
    };

    const setupColors = (rank: number) => {
        switch (rank) {
            case 1:
                setBg(bgColors.first);
                setColor("#000");
                setChevronColor(chevColor.first);
                break;
            case 2:
                setBg(bgColors.second);
                setColor("#fff");
                setChevronColor(chevColor.second);
                break;
            case 3:
                setBg(bgColors.third);
                setColor("#fff");
                setChevronColor(chevColor.third);
                break;
            default:
                setBg(bgColors.other);
                setColor("#fff");
                setChevronColor(chevColor.other);
                break;
        }
    };

    useEffect(() => {
        setBgSize(getBgSize());
        const rank = data.rank.at(-1);
        if (rank) setupColors(rank);
    }, [data, workout]);

    // if (!data) {
    //     return (
    //         <div
    //             className="liveathletezone w-100 d-flex flex-column justify-content-end"
    //             style={{ background: bg, border: borders }}
    //         ></div>
    //     );
    // }
    return (
        <Box
            width={400}
            height={80}
            sx={{ borderRadius: "0px 10px 10px 0px", overflow: "hidden" }}
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
                <Grid container item xs>
                    <Grid
                        container
                        item
                        xs={7}
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        marginLeft={1}
                    >
                        <Grid item>
                            <Typography
                                variant="overline"
                                sx={{
                                    fontFamily: "CantoraOne",
                                    lineHeight: "0.9",
                                }}
                            >
                                {data.category}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            display="flex"
                            // height={1}
                            marginTop="auto"
                            // justifyContent="center"
                            // alignItems={"center"}
                        >
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    mt: "auto",
                                    // ml: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    // whiteSpace: "nowrap",
                                    fontFamily: "CantoraOne",
                                    lineHeight: "0.9",
                                }}
                            >
                                {data.participant}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        marginRight={0}
                    >
                        <Grid item>
                            {!data.result ? (
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={2}
                                    marginRight={1}
                                >
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            fontFamily: "CantoraOne",
                                            lineHeight: "0.9",
                                        }}
                                    >
                                        {`${data.totalRepsOfMovement || ""} ${
                                            data.currentMovement || ""
                                        }:`}
                                    </Typography>
                                    <Typography variant="h6">
                                        {data.repsOfMovement}
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
                                    {data.result.split("|").map((r) => (
                                        <Typography
                                        lineHeight={1.2}
                                        // variant="h6"
                                        >
                                            {r}
                                        </Typography>
                                    ))}
                                </Stack>
                            )}
                        </Grid>
                        <Grid item marginRight={1}>
                            <Typography
                                variant="h6"
                            >
                                {data.rank}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/* jauge */}
                <Grid item height={7} sx={{ background: bg }}>
                    {" "}
                </Grid>
            </Grid>
        </Box>
    );

    // return (
    //     <Box
    //         sx={{
    //             width: bgSize,
    //             height: 67,
    //             maxHeight: "100px",
    //             background: bg,
    //             color: color,
    //             borderTop: "0.5px solid",
    //             borderImage:
    //                 "linear-gradient(90deg, #fff 0%, #fff 98.5%, #00000000 98.5%) 1",
    //             borderBottom: "0.5px solid",
    //             justifyContent: "flex-end",
    //             position: "relative",
    //         }}
    //     >
    //         <Box
    //             sx={{
    //                 display: "flex",
    //                 height: "100%",
    //                 width: "100%",
    //                 alignItems: "center",
    //                 justifyContent: "flex-end",
    //             }}
    //         >
    //             <Typography
    //                 variant="h3"
    //                 component="div"
    //                 sx={{ fontFamily: "CantoraOne" }}
    //             >
    //                 {data.laneNumber}
    //             </Typography>
    //             <Typography
    //                 variant="h3"
    //                 component="div"
    //                 sx={{
    //                     ml: 2,
    //                     mr: 12,
    //                     overflow: "hidden",
    //                     textOverflow: "ellipsis",
    //                     whiteSpace: "nowrap",
    //                     fontFamily: "CantoraOne",
    //                 }}
    //             >
    //                 {data.participant}
    //             </Typography>
    //         </Box>
    //         <Box
    //             className="chevron"
    //             sx={{
    //                 "::after": {
    //                     background: chevronColor,
    //                 },
    //                 "::before": {
    //                     background: chevronColor,
    //                 },
    //             }}
    //         ></Box>
    //     </Box>
    // );
};

export default OverlayRunningAthlete;
