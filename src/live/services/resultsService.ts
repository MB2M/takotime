import Result from "../models/Result";

export const viewResults = async (eventId: string, heatId: string) => {
    await Result.syncIndexes();
    return Result.find({ heatId, eventId }).exec();
};
