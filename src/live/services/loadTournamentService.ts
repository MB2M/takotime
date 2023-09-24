import { liveApp } from "../../app";

const loadFromTournament = async (
    stations: { results: any[] },
    category: string
) => {
    try {
        await liveApp.deleteAllStation();
        const data = await Promise.all(
            stations.results.map(async (r: any) => ({
                laneNumber: r.station,
                participant: r.participant.name,
                category: category,
                externalId: r.participant.customId,
            }))
        );

        await liveApp.stationUpdate(data, "create");
        // await liveApp.keyv.set("externalEventId", externalEventId);
        // await liveApp.keyv.set("externalHeatId", externalHeatId);
        liveApp.websocketMessages.sendGlobalsToAllClients();
    } catch (err) {
        console.error(err);
    }
};

export default loadFromTournament;
