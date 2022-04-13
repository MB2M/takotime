const addZero = (x: number, n: number) => {
    let y = x.toString();
    while (y.length < n) {
        y = "0" + y;
    }
    return y;
};

const toReadableTime = (timestamp: string | number | Date) => {
    const asDate = new Date(timestamp);
    const hours = addZero(asDate.getUTCHours(), 2);
    const minutes = addZero(asDate.getUTCMinutes(), 2);
    const seconds = addZero(asDate.getUTCSeconds(), 2);
    const milli = addZero(asDate.getUTCMilliseconds(), 3);

    return `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds}:${milli}`;
};

export default toReadableTime;
