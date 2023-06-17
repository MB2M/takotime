const addZero = (x: number, n: number) => {
    let y = x.toString();
    while (y.length < n) {
        y = "0" + y;
    }
    return y;
};

const toReadableTime = (
    timestamp: string | number | Date,
    showMs: boolean = true
) => {
    // const asDate = new Date(timestamp);
    const hours = addZero(Math.floor(+timestamp / (3600 * 1000)), 2);
    const minutes = addZero(Math.floor(+timestamp / (60 * 1000)) % 60, 2);
    const seconds = addZero(Math.floor(+timestamp / 1000) % 60, 2);
    const milli = addZero(+timestamp % 1000, 2);

    // const hours = addZero(asDate.getUTCHours(), 2)
    // const minutes = addZero(asDate.getUTCMinutes(), 2);
    // const seconds = addZero(asDate.getUTCSeconds(), 2);
    // const milli = addZero(asDate.getUTCMilliseconds(), 3);

    return `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds}${
        showMs ? `:${milli}` : ""
    } `;
};

export const formatChrono = (
    timer: string | number | null,
    reverse: boolean
) => {
    if (timer?.toString().slice(0, 1) === "-")
        return timer?.toString().slice(1);

    if (reverse) {
        const ms = Number(timer?.toString().slice(6, 9));
        let chronoArray = timer?.toString().slice(0, 5).split(":") || [];

        if (chronoArray.length !== 2) return "";

        if (chronoArray[1] === "00" && chronoArray[0] === "00" && ms === 0)
            return "00:00";
        if (chronoArray[1] === "59") {
            chronoArray[1] = "00";
            chronoArray[0] = (Number(chronoArray[0]) + 1).toString();
        } else {
            chronoArray[1] = (Number(chronoArray[1]) + 1).toString();
        }
        chronoArray = chronoArray.map(
            (element: string) => `${element.length === 1 ? "0" : ""}${element}`
        );
        return chronoArray.join(":");
    }

    return timer?.toString().slice(0, 5);
};

export default toReadableTime;
