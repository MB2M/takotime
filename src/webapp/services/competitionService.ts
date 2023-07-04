import Competition from "../models/Competition";
import { ICompetition } from "../../types/competition";

const getAll = async () => {
    return await Competition.find().exec();
};
const get = async (id: string) => {
    return await Competition.findById(id).exec();
};

const create = async (data: ICompetition) => {
    return await Competition.create(data);
};

const update = async (id: string, data: ICompetition) => {
    return await Competition.findByIdAndUpdate(id, data).exec();
};

const remove = async (id: string) => {
    await Competition.findByIdAndDelete(id).exec();
};

const removeAll = async () => {
    return await Competition.remove();
};

const select = async (id: string) => {
    const competition = await Competition.findById(id).exec();
    if (!competition) return;
    return await competition.select();
};

export { create, getAll, get, update, remove, removeAll, select };
