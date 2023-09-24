import { liveApp } from "../../app";

const loadFromLocal = async (
    externalEventId: number,
    externalWorkoutId: number,
    externalHeatId: number
) => {
    try {
        await liveApp.deleteAllStation();

        await liveApp.keyv.set("externalEventId", externalEventId);
        await liveApp.keyv.set("externalHeatId", externalHeatId);
        await liveApp.keyv.set("externalWorkoutId", externalWorkoutId);
        liveApp.websocketMessages.sendGlobalsToAllClients();
        liveApp.websocketMessages.sendStationsToAllClients();
        liveApp.sendFullConfig("server/wodConfigUpdate");
    } catch (err) {
        console.error(err);
    }
};

export default loadFromLocal;
