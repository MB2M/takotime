import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import liveApp from "../..";

interface StationDevices {
    ip?: string;
    devices?: Array<Object>;
}

export const createDevice: RequestHandler = async (
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
        const result = await liveApp.manager.devicesUpdate(body, "create");
        res.status(200).json(result);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const updateDevice = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    const devices = body.devices?.map((d: Device) => {
        if (d.mac !== "") {
            return d;
        }
    });

    body.devices = devices?.filter((d: Device) => d);

    try {
        const response = await liveApp.manager.devicesUpdate(body, "update");
        res.status(200).json(response);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const deleteDevice = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await liveApp.manager.devicesUpdate(body, "delete");
        res.status(200).json(response);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const getAllStationDevices = async (req: Request, res: Response) => {
    // const stationDevicesList = await StationDevices.find();
    const stationDevicesList = await liveApp.manager.getAllStationDevices();
    if (!stationDevicesList.length)
        return res.status(204).json({ message: "no stationDevices" });

    res.status(200).json(stationDevicesList);
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
