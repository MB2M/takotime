import fetch from "node-fetch";
import liveApp from "..";

const loadFromTournament = async (
    stations: { results: any[] },
    category: string
) => {
    try {
        await liveApp.manager.deleteAllStation();
        await Promise.all(
            stations.results.map(async (r: any) => {
                try {
                    const data = {
                        laneNumber: r.station,
                        participant: r.participant.name,
                        category: category,
                        externalId: r.participant.customId,
                    };
                    await liveApp.manager.stationUpdate(data, "create");
                    // const resp = await StationStatics.findOneAndUpdate(
                    //     { laneNumber: s.station },
                    //     {
                    //         participant: s.participantName,
                    //         category: s.division,
                    //         externalId: s.participantId,
                    //     },
                    //     { upsert: true, runValidators: true }
                    // ).exec();
                } catch (err) {
                    console.log(err);
                }
            })
        );
        // await liveApp.manager.keyv.set("externalEventId", externalEventId);
        // await liveApp.manager.keyv.set("externalHeatId", externalHeatId);
        liveApp.manager.websocketMessages.sendGlobalsToAllClients();
    } catch (err) {
        console.error(err);
    }
};

export default loadFromTournament;
