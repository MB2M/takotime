import { useEffect, useMemo, useState } from "react";
import * as timesync from "timesync";
import toReadableTime from "../utils/timeConverter";

const useChrono = (
    // timesync: timesync.TimeSync | undefined,
    startTime: string | undefined,
    duration: number | undefined
    // isOn: boolean
) => {
    const [chrono, setChrono] = useState<number | string | null>(null);
    const [time, setTime] = useState<number>();

    const cc = useMemo(() => {
        if (!startTime || startTime === "" || !time) {
            return null;
        }
        const diff = time - Date.parse(startTime || "");
        if (diff < 0) {
            return Math.floor(diff / 1000);
        } else {
            return toReadableTime(Math.min((duration || 0) * 60000, diff));
        }
    }, [time]);

    useEffect(() => {
        const ts = timesync.create({
            server: `http://${process.env.NEXT_PUBLIC_LIVE_API}/timesync`,
            interval: 100000,
        });
        const serverT = setInterval(function () {
            const now = ts.now();
            setTime(now);
        }, 250);

        return () => clearInterval(serverT);
    }, []);

    // useEffect(() => {
    //     let timer: NodeJS.Timeout | undefined;
    //     if (!startTime || startTime === "" || !time) {
    //         setChrono(null);
    //     } else {
    //         timer = setInterval(() => {
    //             const diff = time - Date.parse(startTime || "");
    //             if (diff < 0) {
    //                 // setChrono(
    //                 //     toReadableTime(diff)
    //                 // );
    //                 setChrono(Math.floor(diff / 1000));
    //             } else {
    //                 setChrono(
    //                     toReadableTime(Math.min((duration || 0) * 60000, diff))
    //                 );
    //             }
    //         }, 100);
    //     }
    //     return () => {
    //         if (typeof timer !== "undefined") {
    //             clearInterval(timer);
    //         }
    //     };
    // }, [time, startTime, duration]);

    return cc;
};

export default useChrono;
