import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import "../statics/css/LiveAthlete.css";

const MIN_SIZE = 650;
const FULL_WIDTH = 1920;

// linear-gradient(90deg, #3787FF50 0%, #3787FF 99%, rgba(255, 255, 255, 0) 100%)

const colors = {
    first: "linear-gradient(90deg, #FFD60070 0%, #FFD600 99%, rgba(255, 255, 255, 0) 100%)",
    second: "linear-gradient(90deg, #3787FF70 0%, #3787FF 99%, rgba(255, 255, 255, 0) 100%)",
    third: "linear-gradient(90deg, #D4000070 0%, #D40000 99%, rgba(255, 255, 255, 0) 100%)",
    other: "linear-gradient(90deg, #5C5C5C 0%, rgba(33, 33, 33, 0.44) 99%, rgba(255, 255, 255, 0) 100%)",
};

const HorizontalRunningAthlete = ({
    data,
    workout,
}: {
    data: WidescreenStation;
    workout: Workout | undefined;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [color, setColor] = useState("#000");
    const [bg, setBg] = useState("");
    const [borders, setBorders] = useState("");
    const [bgSize, setBgSize] = useState(MIN_SIZE);

    const colorOdd = "#747474";
    const colorEven = "#c0c0c0";
    const textColorDefault = "#c0c0c0";

    // console.log(workout?.blocks.at(-1)?.measurements?.repsTot)
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
        // const score = data.dynamic.score_abs;
        // const sizeOneMvt = 100 / mvtReps.length;

        // let scoreCopy = score;
        // let i = 0;
        // while (scoreCopy - mvtReps[i] >= 0) {
        //     scoreCopy -= mvtReps[i];
        //     i++;
        // }

        // let size;
        // if (i > mvtReps.length - 1) {
        //     size = 100;
        // } else {
        //     size = sizeOneMvt * (i + scoreCopy / mvtReps[i]);
        // }

        // return Math.min(Math.round(size * 100) / 100, 100);
    };

    const getColors = (rank: number) => {
        switch (rank) {
            case 1:
                setBg(colors.second);
                setColor("#000000");
                break;
            case 2:
                setBg(colors.third);
                setColor("#fff");
                break;
        }
    };

    useEffect(() => {
        setBgSize(getBgSize());
        const rank = data.rank.at(-1);
        if (rank) getColors(rank);
    }, [data, workout]);

    // useEffect(() => {
    //     if (!data) {
    //         return;
    //     }

    //     if (data.result) {
    //         switch (data.rank?.at(-1)) {
    //             case 1:
    //                 setBgColor(
    //                     "linear-gradient(to top, #ffc51a50, #ffc51a 30% 70%, #ffc51a50"
    //                 );
    //                 setBorders("1px solid #ffbf00");
    //                 break;
    //             case 2:
    //                 setBgColor(
    //                     "linear-gradient(to top, #c6316e50, #c6316e 30% 70%, #c6316e50"
    //                 );
    //                 setBorders("1px solid #c6316e");
    //                 break;
    //             case 3:
    //                 setBgColor(
    //                     "linear-gradient(to top, #31b9c650, #31b9c6 30% 70%, #31b9c650"
    //                 );
    //                 setBorders("1px solid #31b9c6");
    //                 break;
    //             default:
    //                 setBgColor(
    //                     "linear-gradient(to top, #9a9a9a50, #9a9a9a 30% 70%, #9a9a9a50"
    //                 );
    //                 setBorders("1px solid #c0c0c0");
    //                 break;
    //         }
    //     } else {
    //         setBgColor("");
    //     }
    //     switch (data.rank?.at(-1)) {
    //         case 1:
    //             setColor("#ffbf00");
    //             setTextColor("#ffbf00");
    //             break;
    //         case 2:
    //             setColor("#c6316e");
    //             setTextColor("#c6316e");
    //             break;
    //         case 3:
    //             setColor("#31b9c6");
    //             setTextColor("#31b9c6");
    //             break;
    //         default:
    //             if (data.laneNumber % 2 == 0) {
    //                 setColor(colorEven);
    //             } else {
    //                 setColor(colorOdd);
    //             }
    //             setTextColor(textColorDefault);
    //             break;
    //     }
    // }, [data]);

    // const hrs = [];
    // if (data.wod) {
    //     for (let i = data.wod.mvt_reps.length - 1; i > 0; i--) {
    //         hrs.push(<hr></hr>);
    //     }
    // }

    if (!data) {
        return (
            <div
                className="liveathletezone w-100 d-flex flex-column justify-content-end"
                style={{ background: bg, border: borders }}
            ></div>
        );
    }
    return (
        <Box
            sx={{
                width: bgSize,
                height: 67,
                maxHeight: "100px",
                background: bg,
                color: color,
                borderTop: "#fff 1px solid",
                borderBottom: "#fff 1px solid",
            }}
        >
            {/* // <div

        //     className="liveathletezone w-100 d-flex flex-column justify-content-end"
        //     style={{ background: bgColor, border: borders }}
        // > */}
            <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
                <Typography variant="h3" component="div">
                    {data.laneNumber}
                </Typography>
                <Typography
                    width="100%"
                    variant="h3"
                    component="div"
                    sx={{ mx: 2, overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'CantoraOne'}}
                >
                    {data.participant}
                </Typography>
            </Box>

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
        // </div>
    );
};

export default HorizontalRunningAthlete;
