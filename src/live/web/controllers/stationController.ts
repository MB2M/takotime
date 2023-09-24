import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import { liveApp } from "../../../app";

export const createStation: RequestHandler = async (
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
        const result = await liveApp.stationUpdate(body, "create");
        res.status(200).json(result);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const updateStation = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await liveApp.stationUpdate(body, "update");
        res.status(200).json(response);
        global.liveWodManager.stationStaticsSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const deleteStation = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await liveApp.stationUpdate(body, "delete");
        res.status(200).json(response);
        global.liveWodManager.stationStaticsSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const getAllStation = async (req: Request, res: Response) => {
    const stationStaticsList = await liveApp.getAllStations();
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
