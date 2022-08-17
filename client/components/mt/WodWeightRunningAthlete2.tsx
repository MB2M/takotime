import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const colors = {
    first: "linear-gradient(145deg, #FFD600 , #FFD600)",
    second: "linear-gradient(145deg, #05c1de , #05c1de)",
    third: "linear-gradient(145deg, #fd1085 , #fd1085)",
    other: "linear-gradient(145deg,#5C5C5C, #5C5C5C)",
};

const WodWeightRunningAthlete = ({
    data,
    divNumber,
    wodWeightData,
}: {
    data: any;
    divNumber: number;
    wodWeightData: any;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [color, setColor] = useState("#000");
    const [bg, setBg] = useState("");
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const bgSize = "100%";

    const [rank, setRank] = useState<number | undefined>();

    useEffect(() => {
        // setBgSize(getBgSize());
        if (data?.rank?.length > 0) {
            setRank(data.rank[data.rank.length - 1]);
        }
    }, [data]);

    useEffect(() => {
        switch (data.laneNumber % 2) {
            case 0:
                // setBg(colors.second);
                setBg("lightgray");
                setColor("#000");
                break;
            case 1:
                setBg("gray");
                // setBg(colors.third);
                setColor("#fff");
                break;
            default:
                setBg(colors.other);
                setColor("#fff");
                break;
        }
    }, [data]);

    if (!data) {
        return <div></div>;
    }
    return (
        <Box
            zIndex={10}
            sx={{
                width: `${bgSize}px`,
                height: 1080 / divNumber - 5,
                // maxHeight: "100px",
                background: bg,
                color: color,
                // borderTop: "0.5px solid",
                // borderImage:
                // "linear-gradient(90deg, #fff 0%, #fff 98.5%, #00000000 98.5%) 1",
                // borderBottom: "0.5px solid",
                justifyContent: "flex-start",
                position: "relative",
                borderRadius: data.result
                    ? "0px"
                    : // : "100% 70px 70px 100% / 50% 50% 50% 50%",
                      "5px",
                // background: "linear-gradient(145deg, #dadd17, #ffff1b)",
                // boxShadow: "5px 5px 7px #151515, -5px -5px 7px #333333",
                transition: "width 0.7s",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
                ml={3}
            >
                <Box
                    display={"flex"}
                    justifyContent={"flex-start"}
                    width="500px"
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
                            maxWidth: "500px",
                        }}
                        fontSize={"2.7rem"}
                        noWrap
                    >
                        {data.participant.toUpperCase()}{" "}
                    </Typography>
                </Box>
                <Box ml={4} display={"flex"} gap={2}>
                    {wodWeightData?.scores
                        .filter(
                            (score: { state: string }) =>
                                score.state !== "Cancel"
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
                        ))}
                </Box>
                {data.result && data.rank && (
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
                )}
            </Box>
        </Box>
    );
};

export default WodWeightRunningAthlete;
