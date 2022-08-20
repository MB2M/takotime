import { Box, Typography } from "@mui/material";
import { cp } from "fs/promises";
import { useEffect, useMemo, useState } from "react";

const MIN_SIZE = 650;
const FULL_WIDTH = 1920;

// linear-gradient(90deg, #3787FF50 0%, #3787FF 99%, rgba(255, 255, 255, 0) 100%)

// const colors = {
//     first: "linear-gradient(145deg, #FFD60070 0%, #FFD600 97%, rgba(255, 255, 255, 0) 97%)",
//     second: "linear-gradient(90deg, #3787FF70 0%, #3787FF 97%, rgba(255, 255, 255, 0) 97%)",
//     third: "linear-gradient(90deg, #D4000070 0%, #D40000 97%, rgba(255, 255, 255, 0) 97%)",
//     other: "linear-gradient(90deg, #5C5C5C 0%, rgba(33, 33, 33, 0.44) 97%, rgba(255, 255, 255, 0) 97%)",
// };

const colors = {
    first: "linear-gradient(145deg, #FFD600 , #FFD600)",
    second: "linear-gradient(145deg, #5C5C5C , #5C5C5C)",
    third: "linear-gradient(145deg, #5C5C5C , #5C5C5C)",
    other: "linear-gradient(145deg,#5C5C5C, #5C5C5C)",
};

// const colors = {
//     first: "#FFD600",
//     second: "#3787FF",
//     third: "linear-gradient(145deg, #D4000070 , #D40000 )",
//     other: "linear-gradient(145deg, #5C5C5C , rgba(33, 33, 33, 0.44))",
// };

const useHRunningBackgroundSize = (
    data: WidescreenStation,
    workout: Workout | undefined
) => {
    const totalReps = useMemo(() => {
        return (
            workout?.blocks[workout.blocks.length - 1]?.measurements?.repsTot ||
            0
        );
    }, [workout]);

    const currentReps = useMemo(() => {
        const reps = data.repsPerBlock?.reduce((p, c) => p + c, 0);
        return reps;
    }, [data]);

    if (data.result) return FULL_WIDTH;

    if (!currentReps || !totalReps) return MIN_SIZE;

    return MIN_SIZE + ((FULL_WIDTH - MIN_SIZE) * currentReps) / totalReps;
};

const chevColor = {
    first: "#EECD22",
    second: "#989797",
    third: "#989797",
    other: "#989797",
};

const HorizontalRunningAthlete = ({
    data,
    workout,
    divNumber,
    rankByFront,
}: {
    data: WidescreenStation;
    workout: Workout | undefined;
    divNumber: number;
    rankByFront: number;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [color, setColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [chevronColor, setChevronColor] = useState("");
    const [borders, setBorders] = useState("");
    // const [bgSize, setBgSize] = useState(MIN_SIZE);

    const bgSize = useHRunningBackgroundSize(data, workout);

    const colorOdd = "#747474";
    const colorEven = "#c0c0c0";
    const textColorDefault = "#c0c0c0";
    const [rank, setRank] = useState<number | undefined>();

    useEffect(() => {
        // setBgSize(getBgSize());
        if (data?.rank?.length > 0) {
            setRank(data.rank[data.rank.length - 1]);
        }
    }, [data]);

    useEffect(() => {
        switch (rankByFront) {
            case 1:
                setBg(colors.first);
                setColor("#000000");
                setChevronColor(chevColor.first);
                break;
            case 2:
                setBg(colors.second);
                setColor("#000");
                setChevronColor(chevColor.second);
                break;
            case 3:
                setBg(colors.third);
                setColor("#fff");
                setChevronColor(chevColor.third);
                break;
            default:
                setBg(colors.other);
                setColor("#fff");
                setChevronColor(chevColor.other);
                break;
        }
    }, [rankByFront]);

    if (!data) {
        return <div></div>;
    }
    return (
        <Box
            zIndex={10}
            sx={{
                width: `${bgSize}px`,
                height: 1080 / divNumber - 20,
                // maxHeight: "100px",
                background: bg,
                color: color,
                // borderTop: "0.5px solid",
                // borderImage:
                // "linear-gradient(90deg, #fff 0%, #fff 98.5%, #00000000 98.5%) 1",
                // borderBottom: "0.5px solid",
                justifyContent: "flex-end",
                position: "relative",
                borderRadius: data.result
                    ? "0px"
                    : // : "100% 70px 70px 100% / 50% 50% 50% 50%",
                      "5px",
                // background: "linear-gradient(145deg, #dadd17, #ffff1b)",
                boxShadow: "5px 5px 7px #151515, -5px -5px 7px #333333",
                transition: "width 0.7s",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: data.result ? "space-around" : "flex-end",
                    // paddingRight: "px",
                }}
                ml={3}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems="center"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: "CantoraOne",
                    }}
                    width={data.result ? 800 : 600}
                    // textAlign="end"
                >
                    <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontFamily: "CantoraOne" }}
                        fontSize={"3.5rem"}
                    >
                        {data.laneNumber}
                    </Typography>

                    <Typography
                        variant="h3"
                        component="div"
                        sx={{
                            ml: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "CantoraOne",
                        }}
                        fontSize={"3.5rem"}
                        textAlign="end"
                    >
                        {data.participant.toUpperCase()}{" "}
                    </Typography>
                </Box>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{
                        ml: 2,
                        mr: 5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: "CantoraOne",
                        fontSize: "3.7rem",
                        fontWeight: "800",
                    }}
                    noWrap
                >
                    {data.result?.slice(0, data.result?.length - 1)}
                </Typography>
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
            {/* <Box
                className="chevron"
                sx={{
                    "::after": {
                        background: chevronColor,
                    },
                    "::before": {
                        background: chevronColor,
                    },
                }}
            ></Box> */}

            {/* <div className="live-result">
                {data.result?.includes("CAP")
                    ? data.result?.slice(0, data.result.length - 1)
                    : data.result?.slice(0, data.result.length - 1)}
            </div> */}

            {/* <div className="progress-zone h-100 mx-1 d-flex flex-column justify-content-end">
                <div
                    className="base justify-content-center align-items-center d-inline align-middle"
                    style={{
                        bottom: backgroundSize() + "%",
                        backgroundColor: color,
                    }}
                > */}
            {/* {data.dynamic.currentMouvement[0].cal_h !== 0 && (
                        <div className="base-content-ergo align-middle text-center">
                            {data.dynamic.currentMouvement[0].cal_h}
                        </div>
                    )} */}
            {/* <div
                        className="base-content-top align-middle w-100"
                        style={{ color: textColor }}
                    >
                        <em>#{data.laneNumber}</em>
                    </div>
                    {data.result && (
                        <div
                            className="base-content-bottom align-middle"
                            style={{
                                width: "80%",
                                background: "#ffffff80",
                                color: "black",
                                top: "45px",
                                borderRadius: "25px 8px 25px 8px",
                                border: "1px solid white",
                            }}
                        >
                            {data.rank?.at(-1)}
                        </div>
                    )}
                    {!data.result && (
                        <div
                            className="base-content-bottom align-middle"
                            style={{ color: textColor }}
                        >
                            {data.rank?.at(-1) === 1 ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: "&bigstar;",
                                    }}
                                ></div>
                            ) : (
                                "SCORE RELATIF"
                            )}
                        </div>
                    )}
                </div> */}
            {/* <div className="hrs h-100 mx-0 d-flex flex-column justify-content-evenly">
                    {!data.dynamic.result && hrs}
                </div> */}
            {/* </div> */}
        </Box>
    );
};

export default HorizontalRunningAthlete;
