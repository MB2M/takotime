import fetch from "node-fetch";
import { getCCAccessToken } from "./CCTokenService";
import { liveApp } from "../../app";

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
        await liveApp.deleteAllStation();
        const data = stations
            .filter((s: any) => !!s)
            .map((s: any) => ({
                laneNumber: s.station,
                // participant: s.participantName,
                participant: s.fullName,
                category: s.divisionName,
                externalId: s.id,
            }));

        await liveApp.stationUpdate(data, "create", false);
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

export default loadFromCC;
