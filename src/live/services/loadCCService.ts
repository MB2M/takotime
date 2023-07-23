import fetch from "node-fetch";
import liveApp from "..";
import { getCCAccessToken } from "./CCTokenService";

const loadFromCC = async (
    externalEventId: number,
    externalWorkoutId: number,
    externalHeatId: number
) => {
    try {
        const response = await fetch(
            `https://competitioncorner.net/api2/v1/events/${externalEventId}/workouts/${externalWorkoutId}/heats?per_page=999`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + (await getCCAccessToken()),
                    "Content-Type": "application/json",
                },
            }
        );
        const json: any = await response.json();

        const heat = json.find((s: any) => s.id === externalHeatId);

        const stations = heat.stations;
        await liveApp.manager.deleteAllStation();
        const data = stations
            .filter((s: any) => !!s)
            .map((s: any) => ({
                laneNumber: s.station,
                // participant: s.participantName,
                participant: s.fullName,
                category: s.divisionName,
                externalId: s.id,
            }));

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
