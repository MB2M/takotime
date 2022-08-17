import fetch from "node-fetch";
import liveApp from "..";
import StationStatics from "../models/Station";
import keyvInstance from "./keyvMongo";

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
        await Promise.all(
            stations.map(async (s: any) => {
                try {
                    const data = {
                        laneNumber: s.station,
                        participant: s.participantName,
                        category: s.division,
                        externalId: s.participantId,
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
        await liveApp.manager.keyv.set("externalEventId", externalEventId);
        await liveApp.manager.keyv.set("externalHeatId", externalHeatId);
        await liveApp.manager.keyv.set("externalWorkoutId", externalWorkoutId);
        liveApp.manager.websocketMessages.sendGlobalsToAllClients();
    } catch (err) {
        console.error(err);
    }
};

export default loadFromCC;
