import { useEffect, useState } from "react";
// import "../statics/css/LiveAthlete.css";

const LiveAthlete = ({
    stationStatics,
}: {
    stationStatics: StationStatics;
}) => {
    // const [colors, setColors] = useState('linear-gradient(to top, transparent 60%, #c6316e)')
    const [color, setColor] = useState("#c6316eb4");
    const [bgColor, setBgColor] = useState("");
    const [borders, setBorders] = useState("");
    const [textColor, setTextColor] = useState("");

    const colorOdd = "#747474";
    const colorEven = "#c0c0c0";
    const textColorDefault = "#c0c0c0";

    function backgroundSize(stationStatics) {
        if (stationStatics.result) {
            return 100;
        }

        // const mvtReps = data.wod.mvt_reps;
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
    }

    useEffect(() => {
        if (!data.dynamic) {
            return;
        }

        if (data.dynamic.result) {
            switch (data.dynamic.CurrentRank) {
                case 1:
                    setBgColor(
                        "linear-gradient(to top, #ffc51a50, #ffc51a 30% 70%, #ffc51a50"
                    );
                    setBorders("1px solid #ffbf00");
                    break;
                case 2:
                    setBgColor(
                        "linear-gradient(to top, #c6316e50, #c6316e 30% 70%, #c6316e50"
                    );
                    setBorders("1px solid #c6316e");
                    break;
                case 3:
                    setBgColor(
                        "linear-gradient(to top, #31b9c650, #31b9c6 30% 70%, #31b9c650"
                    );
                    setBorders("1px solid #31b9c6");
                    break;
                default:
                    setBgColor(
                        "linear-gradient(to top, #9a9a9a50, #9a9a9a 30% 70%, #9a9a9a50"
                    );
                    setBorders("1px solid #c0c0c0");
                    break;
            }
        } else {
            setBgColor("");
        }
        switch (data.dynamic.CurrentRank) {
            case 1:
                setColor("#ffbf00");
                setTextColor("#ffbf00");
                break;
            case 2:
                setColor("#c6316e");
                setTextColor("#c6316e");
                break;
            case 3:
                setColor("#31b9c6");
                setTextColor("#31b9c6");
                break;
            default:
                if (data.dynamic.lane % 2 == 0) {
                    setColor(colorEven);
                } else {
                    setColor(colorOdd);
                }
                setTextColor(textColorDefault);
                break;
        }
    }, [data]);

    const hrs = [];
    if (data.wod) {
        for (let i = data.wod.mvt_reps.length - 1; i > 0; i--) {
            hrs.push(<hr></hr>);
        }
    }

    if (!data.dynamic || !data.wod) {
        return (
            <div
                className="liveathletezone w-100 d-flex flex-column justify-content-end"
                style={{ background: bgColor, border: borders }}
            ></div>
        );
    }

    return (
        <div
            className="liveathletezone w-100 d-flex flex-column justify-content-end"
            style={{ background: bgColor, border: borders }}
        >
            <div className="live-result">
                {data.dynamic.result && data.dynamic.result.includes("CAP")
                    ? data.dynamic.result
                    : data.dynamic.result.slice(3)}
            </div>

            <div className="progress-zone h-100 mx-1 d-flex flex-column justify-content-end">
                <div
                    className="base justify-content-center align-items-center d-inline align-middle"
                    style={{
                        bottom: backgroundSize(data) + "%",
                        backgroundColor: color,
                    }}
                >
                    {data.dynamic.currentMouvement[0].cal_h !== 0 && (
                        <div className="base-content-ergo align-middle text-center">
                            {data.dynamic.currentMouvement[0].cal_h}
                        </div>
                    )}
                    <div
                        className="base-content-top align-middle w-100"
                        style={{ color: textColor }}
                    >
                        <em>#{data.static.lane}</em>
                    </div>
                    {data.dynamic.result && (
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
                            {data.dynamic.CurrentRank}
                        </div>
                    )}
                    {!data.dynamic.result && (
                        <div
                            className="base-content-bottom align-middle"
                            style={{ color: textColor }}
                        >
                            {data.dynamic.CurrentRank === 1 ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: "&bigstar;",
                                    }}
                                ></div>
                            ) : (
                                data.dynamic.score_rel
                            )}
                        </div>
                    )}
                </div>
                <div className="hrs h-100 mx-0 d-flex flex-column justify-content-evenly">
                    {!data.dynamic.result && hrs}
                </div>
            </div>
        </div>
    );
};

export default LiveAthlete;
