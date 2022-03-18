import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import StationDevices from "../models/StationDevices";

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
        const result = await StationDevices.create(body);
        res.status(200).json(result);
        global.liveWodManager.devicesSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }

};

export const updateDevice = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.id) {
        return res.status(400).json({ message: "'id' parameter is missing" });
    }

    try {
        const response = await StationDevices.findByIdAndUpdate(body.id, body, {
            runValidators: true,
        }).exec();
        res.status(200).json(response);
        global.liveWodManager.devicesSet();
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
        const response = await StationDevices.findByIdAndDelete(
            body.id,
            body
        ).exec();
        res.status(200).json(response);
        global.liveWodManager.devicesSet();
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

// export const createOrUpdateDevice = async (req: Request, res: Response) => {
//     const body = req.body;

//     if (!body?.laneNumber) {
//         return res
//             .status(400)
//             .json({ message: "'laneNumber' parameter is missing" });
//     }

//     try {
//         const response = await StationDevices.updateOne(
//             {
//                 laneNumber: body.laneNumber,
//             },
//             body,
//             {
//                 upsert: true,
//                 runValidators: true,
//             }
//         ).exec();
//         res.status(200).json(response);
//     } catch (err: any) {
//         if (err.code === 11000) {
//             res.status(400).json({
//                 error: `duplicate key '${
//                     Object.keys(err.keyValue)[0]
//                 }' with value ${Object.values(err.keyValue)[0]}`,
//             });
//         }
//         if (err.errors) {
//             res.status(400).json({
//                 errors: Object.entries(
//                     err.errors as mongoose.Error.ValidatorError
//                 ).map(([k, v]) => {
//                     return `Parameter '${k}' with value '${v.value}' is not allowed`;
//                 }),
//             });
//         }
//     }
// };

export const getAllStationDevices = async (req: Request, res: Response) => {
    const stationDevicesList = await StationDevices.find();
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
