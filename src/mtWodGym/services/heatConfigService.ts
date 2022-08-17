import { IHeatConfig } from "../../types/mt";
import HeatConfig from "../models/HeatConfig";

const viewAll = async () => {
    const heats = await HeatConfig.find();
    return heats;
};

const viewHeatConfig = async (heatId: string) => {
    const heat = await HeatConfig.findOne({ heatId });
    return heat;
};

const update = async (data: IHeatConfig, heatId: string) => {
    await HeatConfig.findOneAndUpdate({ heatId: heatId }, data, {
        upsert: true,
    });

    const heat = await HeatConfig.findOne({ heatId });

    return heat;
};

export { viewAll, update, viewHeatConfig };
