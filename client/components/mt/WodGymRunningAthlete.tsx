import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const colors = {
    first: "#FFD600",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const nameBoxWidth = 520;
const globalScoreBoxWidth = 150;

const WodGymRunningAthlete = ({
    data,
    divNumber,
    rank,
    wodGymData,
    heatConfig,
}: {
    data: any;
    divNumber: number;
    rank: number;
    wodGymData?: GymStation | undefined;
    heatConfig?: HeatConfig;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const bgSize = nameBoxWidth;

    // const [rank, setRank] = useState<number | undefined>();

    // useEffect(() => {
    //     // setBgSize(getBgSize());
    //     if (data?.rank?.length > 0) {
    //         setRank(data.rank[data.rank.length - 1]);
    //     }
    // }, [data]);

    useEffect(() => {
        if (rank > 3 || rank < 1) {
            switch (data.laneNumber % 2) {
                case 0:
                    // setBg(colors.second);
                    setBg("lightgray");
                    setTextColor("#000");
                    break;
                case 1:
                    setBg("gray");
                    // setBg(colors.third);
                    setTextColor("#fff");
                    break;
                default:
                    setBg(colors.other);
                    setTextColor("#fff");
                    break;
            }
        } else {
            switch (rank) {
                case 1:
                    setBg(colors.first);
                    setTextColor("#000");
                    break;

                case 2:
                    setBg(colors.second);
                    setTextColor("#000");
                    break;
                case 3:
                    setBg(colors.third);
                    setTextColor("#000");
                    break;
                default:
                    break;
            }
        }
    }, [data, rank]);

    if (!data) {
        return <div></div>;
    }

    return (
        <Box
            zIndex={10}
            sx={{
                height: 1080 / divNumber,
                color: textColor,
                justifyContent: "flex-start",
                display: "flex",
                width: "100%",
                alignItems: "center",
                position: "relative",
                border: `3px solid ${bg}`,
                borderRadius: data.result
                    ? "0px"
                    : // : "100% 70px 70px 100% / 50% 50% 50% 50%",
                      "5px",
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
                pl={2}
                width={bgSize}
                sx={{ backgroundColor: bg }}
                height={"100%"}
            >
                <Typography
                    component="div"
                    sx={{ fontFamily: "CantoraOne" }}
                    fontSize={"2.7rem"}
                >
                    {data.laneNumber}
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
                    {data.participant.toUpperCase()}{" "}
                </Typography>
            </Box>
            <Box textAlign={"center"} mx="auto">
                <Typography
                    sx={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        color: "white",
                    }}
                >
                    {wodGymData?.scores?.reduce(
                        (p, c) =>
                            p +
                            (c.gymRepCount || 0) *
                                (heatConfig?.rounds?.find(
                                    (round) =>
                                        round.roundNumber === c.roundNumber
                                )?.pointsPerMovement || 0),
                        0
                    )}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                // gap={1}
                height={"100%"}
                justifyContent={"space-evenly"}
                // border="2px solid red"
                // px={1}
            >
                {heatConfig?.rounds
                    ?.sort((a, b) => a.roundNumber - b.roundNumber)
                    .map((round) => {
                        const score = wodGymData?.scores?.find(
                            (score) => score.roundNumber === round.roundNumber
                        );

                        const buyinPercent =
                            ((score?.buyinRepCount || 0) / round.buyInReps) *
                            100;

                        return (
                            <Box
                                width={
                                    (1920 -
                                        nameBoxWidth -
                                        globalScoreBoxWidth -
                                        0) /
                                    3
                                }
                                borderLeft={
                                    buyinPercent > 0
                                        ? `3px solid ${bg}`
                                        : "none"
                                }
                                borderRight={
                                    buyinPercent > 0
                                        ? `3px solid ${bg}`
                                        : "none"
                                }
                                height={"100%"}
                                sx={{
                                    background: `linear-gradient(90deg, #05c1de90 0 , #fd108590 ${buyinPercent}%, #ffffff00 ${buyinPercent}%)`,
                                }}
                                textAlign="center"
                            >
                                {buyinPercent === 100 && (
                                    <Typography
                                        sx={{
                                            fontSize: "3rem",
                                            fontWeight: "800",
                                            color: "white",
                                        }}
                                    >
                                        {(score?.gymRepCount || 0) *
                                            (heatConfig?.rounds?.find(
                                                (round) =>
                                                    round.roundNumber ===
                                                    score?.roundNumber
                                            )?.pointsPerMovement || 0)}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}

                {/* {wodGymData?.scores
                    ?.sort((a, b) => a.roundNumber - b.roundNumber)
                    .map((score: any) => (
                        <Typography
                            component="div"
                            sx={{
                                px: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontFamily: "CantoraOne",
                                fontSize: "3rem",
                                fontWeight: "800",
                                backgroundColor:
                                    score.state === "Success"
                                        ? "green"
                                        : score.state === "Fail"
                                        ? "red"
                                        : "",
                                lineHeight: "1.1",
                                color: "white",
                            }}
                            noWrap
                        >
                            {score.weight}
                        </Typography>
                    ))} */}
            </Box>

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

export default WodGymRunningAthlete;
