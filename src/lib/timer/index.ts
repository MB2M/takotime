import WodTimer from "./WodTimer";

const timers: WodTimer[] = [];

const getTimer = (id: number) => {
    return timers[id] || new WodTimer();
};

export default getTimer;
