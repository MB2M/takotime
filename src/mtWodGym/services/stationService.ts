import { IScoreGym } from "../../types/mt";
import Station from "../models/Station";

const viewStations = async (heatId: string) => {
    const stations = await Station.find({ heatId });
    return stations;
};
const viewStation = async (heatId: string, laneNumber: number) => {
    const station = await Station.findOne({ heatId, laneNumber });
    return station;
};

const update = async (data: IScoreGym, heatId: string, laneNumber: number) => {
    const station = await Station.findOneAndUpdate(
        { heatId, laneNumber },
        data,
        { upsert: true }
    );

    return station;
};

const deleteAll = async () => {
    const stations = await Station.remove();
    return stations;
};

export { viewStations, viewStation, update, deleteAll };
