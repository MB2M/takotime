import { useEffect, useLayoutEffect, useState } from "react";

const LiveStandingAthlete = ({
    stationStatics,
}: {
    stationStatics: StationStatics;
}) => {
    const [color, setColor] = useState("#transparent");
    const [status, setStatus] = useState("W");
    const [leftReady, setLeftReady] = useState("-100%");
    const [fontColor, setFontColor] = useState("white");

    useEffect(() => {
        if (stationStatics) {
            // switch (stationStatics.rank) {
            //     case 1:
            //         setColor("#ffbf00");
            //         setFontColor("black");
            //         break;
            //     case 2:
            //         setColor("#c6316e");
            //         setFontColor("black");
            //         break;
            //     case 3:
            //         setColor("#31b9c6");
            //         setFontColor("black");
            //         break;
            //     default:
            setColor("transparent");
            setFontColor("white");
            // break;
            // }
        }
        // if (athleteData.dynamic) {
        //     setStatus(athleteData.dynamic.status);
        // }
    }, [stationStatics]);

    useLayoutEffect(() => {
        if (status === "S") {
            setLeftReady("-100%");
            const wait = setTimeout(() => {
                setLeftReady("0");
            }, 100);

            return () => clearTimeout(wait);
        }
    }, [status]);

    return (!stationStatics ? null :

     (
        stationStatics && (
            <div
                className="liveresult w-100 d-flex align-items-center px-2 h2 my-0 py-2 border default-font display-6 fw-bold"
                style={{ backgroundColor: color, color: fontColor }}
            >
                <div className="live-standing-lane me-4">
                    {stationStatics.laneNumber}
                </div>
                <div className="live-standing-name text-wrap me-auto lh-1">
                    {stationStatics.participant.slice(0, 50).toUpperCase()}
                </div>
                {/* <div className="live-standing-points text-wrap ms-auto lh-1">
                {stationStatics.overallPoints}
            </div> */}
                {status === "S" && (
                    <div
                        className="live-ready text-end text-dark align-items-center p-2 pt-3 strasua"
                        style={{ left: leftReady }}
                    >
                        <em>READY !</em>
                    </div>
                )}
            </div>
        )
    ));
};

export default LiveStandingAthlete;
