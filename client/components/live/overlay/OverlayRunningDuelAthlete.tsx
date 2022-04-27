import { Box, Fade, Grid, Slide, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toReadableTime from "../../../utils/timeConverter";

const bgColors = {
    first: "#FFD600",
    other: "#5C5C5C",
};

// const bgColors = {
//     first: "linear-gradient(90deg, #FFD60070 0%, #FFD600 97%, rgba(255, 255, 255, 0) 97%)",
//     second: "linear-gradient(90deg, #3787FF70 0%, #3787FF 97%, rgba(255, 255, 255, 0) 97%)",
//     third: "linear-gradient(90deg, #D4000070 0%, #D40000 97%, rgba(255, 255, 255, 0) 97%)",
//     other: "linear-gradient(90deg, #5C5C5C 0%, rgba(33, 33, 33, 0.44) 97%, rgba(255, 255, 255, 0) 97%)",
// };

const OverlayRunningDuelAthlete = ({
    data,
    workout,
    position,
    opposantData,
}: {
    data: WidescreenStation;
    workout: Workout | undefined;
    position: "left" | "right";
    opposantData: WidescreenStation;
}) => {
    const [bg, setBg] = useState("");
    const [showTieBreak, setShowTieBreak] = useState(false);
    const measurementsNumber = useRef(0);

    const setupColors = (rank: number) => {
        switch (rank) {
            case 1:
                setBg(bgColors.first);
                break;
            default:
                setBg(bgColors.other);
                break;
        }
    };

    useEffect(() => {
        const rank = data.rank[data.measurements?.length || 0];
        if (rank) setupColors(rank);
        if (data.measurements?.length > measurementsNumber.current) {
            setShowTieBreak(true);
            const timer = setTimeout(() => setShowTieBreak(false), 10000);
            measurementsNumber.current = data.measurements?.length;
        }
    }, [data, workout]);

    return (
        <Stack
            alignItems={position === "left" ? "flex-start" : "flex-end"}
            height={1}
        >
            <Slide
                    direction={position === "left" ? "right" : "left"}
                    in={true}
                ><Box
                width={600}
                height={150}
                sx={{
                    borderRadius:
                        position === "left"
                            ? "0px 10px 10px 0px"
                            : "10px 0px 0px 10px",
                    overflow: "hidden",
                }}
            >
                <Grid
                    container
                    spacing={0}
                    direction={"column"}
                    justifyContent="space-between"
                    sx={{
                        height: "100%",
                        background: "#000000f2",
                        color: "white",
                    }}
                >
                    <Grid
                        container
                        item
                        xs
                        direction={position === "left" ? "row" : "row-reverse"}
                    >
                        <Grid
                            container
                            item
                            xs={7}
                            direction="column"
                            justifyContent="space-between"
                            alignItems={
                                position === "left" ? "flex-start" : "flex-end"
                            }
                            marginX={1}
                        >
                            <Grid
                                item
                                width={1}
                                textAlign={
                                    position === "left" ? "right" : "left"
                                }
                            >
                                {!data.result && (
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: "CantoraOne",
                                            lineHeight: "0.9",
                                        }}
                                    >
                                        {`${data.totalRepsOfMovement || ""} ${
                                            data.currentMovement || ""
                                        }`}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid
                                item
                                marginTop="auto"
                                textAlign={
                                    position === "left" ? "left" : "right"
                                }
                            >
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{
                                        mt: "auto",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
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
                            alignItems={
                                position === "left" ? "flex-end" : "flex-start"
                            }
                            marginX={1}
                        >
                            <Grid item>
                                {!data.result ? (
                                    <Stack
                                        direction="row"
                                        justifyContent={
                                            position === "left"
                                                ? "flex-end"
                                                : "flex-start"
                                        }
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Typography variant="h4">
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
                                                variant={"h5"}
                                            >
                                                {r}
                                            </Typography>
                                        ))}
                                    </Stack>
                                )}
                            </Grid>
                            <Grid item marginRight={1}>
                                <Typography variant="h2">
                                    {data.rank[
                                        data.measurements?.length || 0
                                    ] ||
                                        data.rank[
                                            data.measurements?.length - 1
                                        ]}
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
            </Slide>
            {/* <Box marginTop={0}> */}
            {/* <Stack> */}
            {data.measurements?.map((m) => (
                <Slide
                    direction={position === "left" ? "right" : "left"}
                    in={true}
                >
                    <Typography
                        variant="h5"
                        color="gray"
                        textAlign={"right"}
                        sx={{ backgroundColor: "#000000d2" }}
                        padding={1}
                        borderRadius={
                            position === "left"
                                ? "0px 4px 20px 0px"
                                : "4px 0px 0px 20px "
                        }
                    >{`R${m.id + 1}: ${
                        m.tieBreak?.value
                            ? toReadableTime(m.tieBreak.value)
                            : "DNF"
                    }`}</Typography>
                </Slide>
            ))}
            {/* </Stack> */}
            {/* {showTieBreak && ( */}
            <Fade in={showTieBreak}>
                <Box
                    marginTop={"auto"}
                    width={400}
                    height={170}
                    sx={{ mt: "auto", backgroundColor: "#000000f2" }}
                    textAlign={"center"}
                    padding={2}
                    borderRadius={
                        position === "left"
                            ? "0px 20px 0px 0px"
                            : "20px 0px 0px 0px "
                    }
                    borderTop={`5px solid ${bg}`}
                >
                    <Typography variant="h4">
                        <u>{`Round ${data.measurements?.length}`}</u>
                    </Typography>
                    <Typography variant="h4">
                        {`${
                            data?.measurements &&
                            data.measurements.at(-1)?.tieBreak?.value
                                ? toReadableTime(
                                      data.measurements.at(-1)?.tieBreak?.value
                                  )
                                : "DNF"
                        }`}
                    </Typography>

                    {data?.measurements &&
                        opposantData.measurements &&
                        data?.measurements[data.measurements?.length - 1]
                            .tieBreak?.value >
                            opposantData.measurements[
                                data.measurements?.length - 1
                            ]?.tieBreak.value && (
                            <Typography variant="h4" color={"red"}>
                                -
                                {toReadableTime(
                                    data?.measurements[
                                        data.measurements?.length - 1
                                    ].tieBreak?.value -
                                        opposantData?.measurements[
                                            data.measurements?.length - 1
                                        ].tieBreak?.value
                                )}
                            </Typography>
                        )}
                </Box>
            </Fade>
            {/* )} */}
        </Stack>
    );
};

export default OverlayRunningDuelAthlete;
