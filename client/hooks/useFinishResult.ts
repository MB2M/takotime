import { toReadableTime } from "../components/bigscreen/WodRunningAthlete";
import React from "react";

const useFinishResult = (station: WidescreenStation, wodIndex: number) => {
    const [finishResult, setFinishResult] = React.useState<
        string | undefined
    >();

    React.useEffect(() => {
        setFinishResult(
            station.result?.replace("|", " | ") ||
                (!station.measurements?.[wodIndex]
                    ? undefined
                    : station.measurements[wodIndex].method === "time"
                    ? toReadableTime(station.measurements[wodIndex].value)
                    : `${station.measurements[
                          wodIndex
                      ].value?.toString()} reps|`)
        );
    }, [station, wodIndex]);

    return finishResult;
};

export default useFinishResult;
