import { IBaseStation } from "../../types/deviceScoring";
import Station from "../models/Station";
import { QueryOptions } from "mongoose";

const viewStations = async (heatId: string) => {
    return await Station.find({ heatId });
};
const viewStation = async (heatId: string, laneNumber: number) => {
    return await Station.findOne({ heatId, laneNumber });
};

const update = async (
    score: number,
    heatId: string,
    scoreIndex: string,
    laneNumber: number,
    participant: string,
    time?: number
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
            participant,
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
            { heatId, laneNumber, participant },
            { $push: { scores: { repCount: score, index: scoreIndex } } }
        );
    }

    let updateData: QueryOptions<IBaseStation> = {
        $set: {
            "scores.$.repCount": score,
        },
        participant,
    };
    // if (time) {
    //     updateData = {
    //         ...updateData,
    //         times: {
    //             $cond: [
    //                 { times: { $elemMatch: { rep: { $eq: score } } } },
    //
    //                 {
    //                     $reduce: {
    //                         input: "$times",
    //                         initialValue: [],
    //                         in: {
    //                             $concatArrays: [
    //                                 "$$value",
    //                                 [
    //                                     {
    //                                         $cond: [
    //                                             {
    //                                                 $eq: ["$$this.rep", score],
    //                                             },
    //                                             {
    //                                                 $mergeObjects: [
    //                                                     "$$this",
    //                                                     { time: time },
    //                                                 ],
    //                                             },
    //                                             "$$this",
    //                                         ],
    //                                     },
    //                                 ],
    //                             ],
    //                         },
    //                     },
    //                 },
    //                 {
    //                     $concatArrays: ["$times", [{ rep: score, time: time }]],
    //                 },
    //             ],
    //         },
    //     };
    // }

    if (time) {
        updateData = {
            ...updateData,
            $addToSet: {
                times: { rep: score, time: time, index: Number(scoreIndex) },
            },
        };
    }

    // console.log(updateData);
    return Station.findOneAndUpdate(
        { heatId, laneNumber, "scores.index": Number(scoreIndex) },
        updateData
        // { arrayFilters: [{ "elem.rep": score }] }
    );
};

const deleteAll = async () => {
    return Station.remove();
};

export { viewStations, viewStation, update, deleteAll };
