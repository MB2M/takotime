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
    const [keepScore, setKeepScore] = useState<boolean>(false);

    const lastScore = useMemo(() => {
        return wodWeightData?.scores
            ?.sort((a: { _id: string; }, b: { _id: string; }) => parseInt(b._id, 16) - parseInt(a._id, 16))
            .find((score: { state: string }) =>
                ["Success", "Fail"].includes(score.state)
            );
    }, [wodWeightData]);

    const currentTry = useMemo(
        () =>
            wodWeightData?.scores?.sort((a: { _id: string; }, b: { _id: string; }) => parseInt(b._id, 16) - parseInt(a._id, 16)).find(
                (score: { state: string }) => score.state === "Try"
            ),
        [wodWeightData]
    );

    const currentTryRef = useRef<any>();

    useEffect(() => {
        if (!currentTry && currentTryRef.current?.state === "Try") {
            setKeepScore(true);
            const timer = setTimeout(() => {
                setKeepScore(false);
            }, 5000);
        }
        currentTryRef.current = currentTry;
        // return clearTimeout(timer);
    }, [currentTry]);

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
                    background: "#000000f2",
                    color: "white",
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
                {/* jauge */}
                {/* <Grid item height={7} sx={{ background: bg }}></Grid> */}
                <Grid
                    container
                    item
                    height={30}
                    justifyContent={"space-evenly"}
                >
                    {data.result && (
                        <Grid item xs={6}>
                            <Typography fontSize={"1.3rem"}>
                                Best: {data.result} kg
                            </Typography>
                        </Grid>
                    )}
                    {lastScore && (
                        <Grid item xs={6}>
                            <Typography
                                fontSize={"1.3rem"}
                                color={
                                    lastScore.state === "Success"
                                        ? "green"
                                        : lastScore.state === "Fail"
                                        ? "red"
                                        : "white"
                                }
                            >
                                Last: {lastScore?.weight} kg
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Box
                width={"130px"}
                sx={{
                    backgroundColor: keepScore
                        ? lastScore.state === "Success"
                            ? "green"
                            : "red"
                        : "#000000c0",
                    color: "white",
                }}
                alignItems="center"
                display="flex"
                justifyContent="center"
            >
                <Typography fontSize={"2rem"}>
                    {keepScore ? lastScore?.weight : currentTry?.weight}
                </Typography>
            </Box>
        </Box>
    );
};

export default WodWeightOverlayRunningAthlete;
