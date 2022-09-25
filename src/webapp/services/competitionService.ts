import Competition from "../models/Competition";

const getAll = async () => {
    const competitions = await Competition.find().exec();
    return competitions;
};
const get = async (id: string) => {
    const competition = await Competition.findById(id).exec();
    return competition;
};

const create = async (data: ICompetition) => {
    const competition = await Competition.create(data);
    return competition;
};

const update = async (id: string, data: ICompetition) => {
    const competition = await Competition.findByIdAndUpdate(id, data).exec();
    return competition;
};

const remove = async (id: string) => {
    await Competition.findByIdAndDelete(id).exec();
};

const removeAll = async () => {
    const competitions = await Competition.remove();
    return competitions;
};

const select = async (id: string) => {
    const competition = await Competition.findById(id).exec();
    return await competition.select();
};

export { create, getAll, get, update, remove, removeAll, select };
