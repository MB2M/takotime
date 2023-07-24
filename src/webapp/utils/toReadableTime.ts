const addZero = (x: number, n: number) => {
    let y = x.toString();
    while (y.length < n) {
        y = "0" + y;
    }
    return y;
};

const addZeroAfter = (x: number, n: number) => {
    let y = x.toString();
    while (y.length < n) {
        y = y + "0";
    }
    return y;
};

export const toReadableTime = (
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
        showMs ? `.${addZeroAfter(+milli, 3)}` : ""
    }`;
};
