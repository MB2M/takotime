import fetch from "node-fetch";
import liveApp from "..";

const CCURL = `https://competitioncorner.net/api2/v1/schedule/workout/`;

const loadFromCC = async (
    externalEventId: number,
    externalWorkoutId: number,
    externalHeatId: number
) => {
    const url = CCURL + externalWorkoutId;
    try {
        const response = await fetch(url);
        const json: any = await response.json();

        const heat = json.find((s: any) => s.id === externalHeatId);
        const stations = heat.stations;
        await liveApp.manager.deleteAllStation();
        const data = await Promise.all(
            stations.map(async (s: any) => ({
                laneNumber: s.station,
                participant: s.participantName,
                category: s.division,
                externalId: s.participantId,
            }))
        );
        await liveApp.manager.stationUpdate(data, "create", false);
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

export default loadFromCC;
