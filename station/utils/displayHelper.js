const displayBuffer = (db, meta) => {
    try {
        const station = db.getData("/stations");
        switch (station.state) {
            case 0:
                return loadedDisplay(station);
            case 1:
                return countdownDisplay(station, meta);
            case 2:
                return runningDisplay(station, meta);
            case 3:
                return endedDisplay(station);
            default:
                return loadedDisplay(station);
        }
    } catch (err) {
        return loading();
    }
};

const getCounterInfo = (station) => {
    const counter = station.configs.devices.find((d) => d.role === "counter");
    if (counter)
        return `${counter.mac.slice(-4)}(${counter.state.slice(0, 1)})`;
};

const loadedDisplay = (station) => {
    return Buffer.from(
        JSON.stringify({
            lane_number: station.lane_number,
            name: station.athlete,
            result: "READY|TO GO |",
            counter: getCounterInfo(station),
        })
    );
};

const countdownDisplay = (station, meta) => {
    return Buffer.from(
        JSON.stringify({
            lane_number: station.lane_number,
            name: station.athlete,
            countdown: (meta && meta.value) || "",
            counter: getCounterInfo(station),
        })
    );
};

const runningDisplay = (station, meta) => {
    const counter = station.configs.devices.find((d) => d.role === "counter");

    if (counter) counter.mac.slice(-4);

    return Buffer.from(
        JSON.stringify({
            lane_number: station.lane_number,
            reps: station.dynamics.currentWodPosition.reps,
            name: station.athlete,
            result: station.dynamics.result,
            round: station.dynamics.currentWodPosition.round + 1,
            movement: `${station.dynamics.currentWodPosition.totalRepsOfMovement} ${station.dynamics.currentWodPosition.currentMovement}`,
            movement_reps: station.dynamics.currentWodPosition.repsOfMovement,
            next_movement: `${station.dynamics.currentWodPosition.nextMovementReps} ${station.dynamics.currentWodPosition.nextMovement}`,
            counter: getCounterInfo(station),
        })
    );
};

const endedDisplay = (station) => {
    return Buffer.from(
        JSON.stringify({
            lane_number: station.lane_number,
            name: station.athlete,
            result: station.dynamics.result,
            counter: getCounterInfo(station),
        })
    );
};

const loading = () => {
    return Buffer.from(
        JSON.stringify({
            result: "LOADING|...",
        })
    );
};

export default displayBuffer;
