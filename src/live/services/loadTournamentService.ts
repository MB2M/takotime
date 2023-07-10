import liveApp from "..";

const loadFromTournament = async (
    stations: { results: any[] },
    category: string
) => {
    try {
        await liveApp.manager.deleteAllStation();
        const data = await Promise.all(
            stations.results.map(async (r: any) => ({
                laneNumber: r.station,
                participant: r.participant.name,
                category: category,
                externalId: r.participant.customId,
            }))
        );

        // await Promise.all(
        //     stations.results.map(async (r: any) => {
        //         try {
        //             const data = {
        //                 laneNumber: r.station,
        //                 participant: r.participant.name,
        //                 category: category,
        //                 externalId: r.participant.customId,
        //             };
        //
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     })
        // );
        await liveApp.manager.stationUpdate(data, "create");
        // await liveApp.manager.keyv.set("externalEventId", externalEventId);
        // await liveApp.manager.keyv.set("externalHeatId", externalHeatId);
        liveApp.manager.websocketMessages.sendGlobalsToAllClients();
    } catch (err) {
        console.error(err);
    }
};

export default loadFromTournament;
