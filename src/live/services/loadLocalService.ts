import fetch from "node-fetch";
import liveApp from "..";
import StationStatics from "../models/Station";
import keyvInstance from "./keyvMongo";

const loadFromLocal = async (
    externalEventId: number,
    externalWorkoutId: number,
    externalHeatId: number
) => {
    try {
        await liveApp.manager.deleteAllStation();

        await liveApp.manager.keyv.set("externalEventId", externalEventId);
        await liveApp.manager.keyv.set("externalHeatId", externalHeatId);
        await liveApp.manager.keyv.set("externalWorkoutId", externalWorkoutId);
        liveApp.manager.websocketMessages.sendGlobalsToAllClients();
        liveApp.manager.websocketMessages.sendStationsToAllClients();
        liveApp.manager.sendFullConfig("server/wodConfigUpdate");
    } catch (err) {
        console.error(err);
    }
};

export default loadFromLocal;
