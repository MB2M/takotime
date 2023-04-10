import { IScore } from "../../types/mt";
import Station from "../models/Station";

const viewStations = async (heatId: string) => {
    return await Station.find({ heatId });
};
const viewStation = async (heatId: string, laneNumber: number) => {
    return await Station.findOne({ heatId, laneNumber });
};

const add = async (data: IScore, heatId: string, laneNumber: number) => {
    let stationExist = await Station.exists({ heatId, laneNumber });
    if (!stationExist) {
        await Station.create({ heatId, laneNumber });
    }

    const station = await Station.findOne({
        heatId,
        laneNumber,
    });

    if (!station) return;

    if (!station.scores) {
        station.scores = [];
    }

    station.scores.push(data);

    await station.save();
    return station;
};

const update = async (data: IScore, scoreId: string) => {
    // const station = await Station.findOneAndUpdate(
    //     { "scores._id": scoreId },
    //     {
    //         $set: {
    //             "state.$": data.state,
    //         },
    //     }
    // );

    const station = await Station.findOne({ "scores._id": scoreId });

    if (!station?.scores?.id(scoreId)) return;

    let score = station.scores.id(scoreId);

    if (!score) return;
    score.state = data.state;

    // console.log(station);

    // const scores = station.scores?.map((score) => {
    //     if (score._id.toString() === scoreId) {
    //         console.log("ézes");
    //         console.log({ ...score, ...data });
    //         return { ...score, ...data };
    //     }
    //     return score;
    // });

    // station.scores = scores;

    // console.log(scores);
    await station.save();
    return station;
};

const deleteAll = async () => {
    return await Station.remove();
};

export { viewStations, viewStation, add, update, deleteAll };
