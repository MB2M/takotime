import { IBaseScore } from "../../types/deviceScoring";
import Station from "../models/Station";

const viewStations = async (heatId: string) => {
    const stations = await Station.find({ heatId });
    return stations;
};
const viewStation = async (heatId: string, laneNumber: number) => {
    const station = await Station.findOne({ heatId, laneNumber });
    return station;
};

const update = async (
    score: number,
    heatId: string,
    scoreIndex: string,
    laneNumber: number
) => {
    if (
        !(await Station.exists({
            heatId,
            laneNumber,
        }))
    ) {
        await Station.create({
            heatId,
            laneNumber,
        });
    }

    if (
        !(await Station.exists({
            heatId,
            laneNumber,
            "scores.index": Number(scoreIndex),
        }))
    ) {
        await Station.updateOne(
            { heatId, laneNumber },
            { $push: { scores: { repCount: score, index: scoreIndex } } }
        );
    }
    const station = await Station.findOneAndUpdate(
        { heatId, laneNumber, "scores.index": Number(scoreIndex) },
        {
            $set: {
                "scores.$.repCount": score,
            },
        }
    );

    return station;
};

const deleteAll = async () => {
    const stations = await Station.remove();
    return stations;
};

export { viewStations, viewStation, update, deleteAll };
