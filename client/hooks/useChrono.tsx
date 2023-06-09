import { useEffect, useMemo, useState } from "react";
import * as timesync from "timesync";
import toReadableTime from "../utils/timeConverter";

const useChrono = (
    // timesync: timesync.TimeSync | undefined,
    startTime?: string,
    duration?: number,
    reverse: boolean = false
    // isOn: boolean
) => {
    const [time, setTime] = useState<number>();
    const [ts, setTs] = useState<timesync.TimeSync>();
    const [plainTimer, setPlainTimer] = useState<number>(0);

    const timer = useMemo(() => {
        if (!startTime || startTime === "" || !time || !ts) {
            return null;
        }
        const diff = ts.now() - Date.parse(startTime || "");
        setPlainTimer(diff);
        if (diff < 0) {
            return Math.floor(diff / 1000);
        } else {
            return reverse
                ? toReadableTime(Math.max((duration || 0) * 60000 - diff, 0))
                : toReadableTime(Math.min((duration || 0) * 60000, diff));
        }
    }, [time]);

    useEffect(() => {
        const ts = timesync.create({
            server: `http://${process.env.NEXT_PUBLIC_LIVE_API}/timesync`,
            interval: 100000,
        });
        setTs(ts);
        const serverT = setInterval(function () {
            const now = ts.now();
            setTime(now);
        }, 250);

        return () => clearInterval(serverT);
    }, []);

    return { timer, ts, plainTimer };
};

export default useChrono;
