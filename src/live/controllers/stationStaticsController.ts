import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import StationStatics from "../models/StationStatics";

export const createStationStatic: RequestHandler = async (
    req: Request,
    res: Response
) => {
    const body = req.body;

    if (!body?.laneNumber) {
        return res
            .status(400)
            .json({ message: "'laneNumber' parameter is missing" });
    }

    try {
        const result = await StationStatics.create(body);
        res.status(200).json(result);
        global.liveWodManager.stationStaticsSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const updateStationStatic = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await StationStatics.findByIdAndUpdate(body.id, body, {
            runValidators: true,
        }).exec();
        res.status(200).json(response);
        global.liveWodManager.stationStaticsSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const deleteStationStatic = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await StationStatics.findByIdAndDelete(
            body.id,
            body
        ).exec();
        res.status(200).json(response);
        global.liveWodManager.stationStaticsSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const getAllStationDevices = async (req: Request, res: Response) => {
    const stationStaticsList = await StationStatics.find();
    if (!stationStaticsList.length)
        return res.status(204).json({ message: "no stationDevices" });

    res.status(200).json(stationStaticsList);
};

const handleErrorDevice = (err: any, res: Response) => {
    if (err.code === 11000) {
        res.status(400).json({
            error: `duplicate key '${
                Object.keys(err.keyValue)[0]
            }' with value ${Object.values(err.keyValue)[0]}`,
        });
    }
    if (err.errors) {
        res.status(400).json({
            errors: Object.entries(
                err.errors as mongoose.Error.ValidatorError
            ).map(([k, v]) => {
                return `Parameter '${k}' with value '${v.value}' is not allowed`;
            }),
        });
    }
};
