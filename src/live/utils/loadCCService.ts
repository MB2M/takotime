import fetch from "node-fetch";
import StationStatics from "../models/StationStatics";
import keyvInstance from "./libs/keyvInstance";

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
        await StationStatics.deleteMany().exec();
        await Promise.all(
            stations.map(async (s: any) => {
                try {
                    const resp = await StationStatics.findOneAndUpdate(
                        { laneNumber: s.station },
                        {
                            participant: s.participantName,
                            category: s.division,
                            externalId: s.participantId,
                        },
                        { upsert: true, runValidators: true }
                    ).exec();
                } catch (err) {
                    console.log(err);
                }
            })
        );
        await keyvInstance.set("externalEventId", externalEventId);
        await keyvInstance.set("externalHeatId", externalHeatId);
        global.liveWodManager.stationStaticsSet();
        global.liveWodManager.externalLoadSet();
    } catch (err) {
        console.error(err);
    }
};

export default loadFromCC;
