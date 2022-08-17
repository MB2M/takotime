import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState, useRef } from "react";
import styles from "../../styles/WodWeightRunningAthlete.module.css";

const colors = {
    first: "#FFD600",
    second: "#05c1de",
    third: "#fd1085",
    other: "#5C5C5C",
};

const WodWeightRunningAthlete = ({
    data,
    divNumber,
    wodWeightData,
    highestBar,
}: {
    data: any;
    divNumber: number;
    wodWeightData: any;
    highestBar: number;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [textColor, setTextColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [keepScore, setKeepScore] = useState<boolean>(false);

    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const [rank, setRank] = useState<number | undefined>();

    const lastScore = useMemo(() => {
        return wodWeightData?.scores
            ?.sort(
                (a: { _id: string }, b: { _id: string }) =>
                    parseInt(b._id, 16) - parseInt(a._id, 16)
            )
            .find((score: { state: string }) =>
                ["Success", "Fail"].includes(score.state)
            );
    }, [wodWeightData]);

    const currentTry = useMemo(
        () =>
            wodWeightData?.scores
                ?.sort(
                    (a: { _id: string }, b: { _id: string }) =>
                        parseInt(b._id, 16) - parseInt(a._id, 16)
                )
                .find((score: { state: string }) => score.state === "Try"),
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

    useEffect(() => {
        // setBgSize(getBgSize());
        if (data?.rank?.length > 0) {
            setRank(data.rank[data.rank.length - 1]);
        }
    }, [data]);

    useEffect(() => {
        switch (data.rank) {
            case 1:
                // setBg(colors.second);
                setBg(colors.first);
                setTextColor("#000");
                break;
            case 2:
                setBg(colors.second);
                setTextColor("#fff");
                break;
            case 3:
                setBg(colors.third);
                setTextColor("#fff");
                break;
                // setBg(colors.third);
                break;
            default:
                setBg(colors.other);
                setTextColor("#fff");
                break;
        }
    }, [data]);

    if (!data) {
        return <div></div>;
    }
    return (
        <Stack
            className={
                highestBar === currentTry?.weight && currentTry?.weight > 0
                    ? styles.glowing_card
                    : ""
            }
            sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                justifyContent: "flex-start",
                position: "relative",
                zIndex: highestBar === currentTry?.weight ? 1 : 0,
                borderRadius: "6px",
                border:
                    highestBar === currentTry?.weight ? "" : `2px solid ${bg}`,
            }}
            // ml={3}
        >
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                height="50px"
                width="100%"
                sx={{
                    backgroundColor: bg,
                    color: textColor,
                    borderRadius: "6px",
                }}
                pl={1}
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
                    {data.participant.toUpperCase()}
                </Typography>
            </Box>
            <Stack direction={"row"} gap={2} height={"100%"}>
                <Box
                    width={"50%"}
                    height={"100%"}
                    sx={{
                        backgroundColor: keepScore
                            ? lastScore.state === "Success"
                                ? "green"
                                : "red"
                            : "#00000000",
                        color: "white",
                    }}
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                >
                    <Typography fontSize={80}>
                        {keepScore ? lastScore?.weight : currentTry?.weight}
                    </Typography>
                </Box>
                <Stack gap={2} width={"50%"}>
                    <Box
                        width={"100%"}
                        height={"50%"}
                        display={"flex"}
                        color="white"
                        justifyContent="center"
                        alignItems={"center"}
                    >
                        <Typography fontSize={50}>{data.result}</Typography>
                    </Box>
                    <Box
                        width={"100%"}
                        height={"50%"}
                        // sx={{ backgroundColor: "orange" }}
                        display={"flex"}
                        justifyContent="center"
                        alignItems={"center"}
                        sx={{
                            backgroundColor:
                                lastScore?.state === "Success"
                                    ? "green"
                                    : lastScore?.state === "Fail"
                                    ? "red"
                                    : "ffffffff",
                        }}
                    >
                        <Typography fontSize={50} noWrap>
                            {lastScore?.weight}
                        </Typography>
                    </Box>
                </Stack>
                {/* {wodWeightData?.scores
                    .filter(
                        (score: { state: string }) => score.state !== "Cancel"
                    )
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
            </Stack>
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
        </Stack>
    );
};

export default WodWeightRunningAthlete;
