import { Request, Response } from "express";
import mongoose from "mongoose";
import StationDevices from "../models/StationDevices";

export const createOrUpdateDevice = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.laneNumber) {
        return res
            .status(400)
            .json({ message: "'laneNumber' parameter is missing" });
    }

    // if (!body?.ip && !body.devices) {
    //     return res
    //         .status(400)
    //         .json({ message: "provice at least 'ip' or 'devices' parameter" });
    // }
    console.log(body.laneNumber);
    const stationDevices = await StationDevices.findOne({
        laneNumber: body.laneNumber,
    }).exec();
    console.log(stationDevices);
    if (stationDevices) {
        if (typeof body.ip !== "undefined") stationDevices.ip = body.ip;
        if (typeof body.devices !== "undefined")
            stationDevices.devices = body.devices;
        try {
            const result = await stationDevices.save();
            res.status(200).json(result);
        } catch (err: any) {
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
        }
    } else {
        // if (!body.ip || !body.devices) {
        //     return res
        //         .status(400)
        //         .json({ message: "missing ip and/or devices information" });
        // } else {
        try {
            const result = await StationDevices.create({
                laneNumber: body.laneNumber,
                ip: body.ip,
                devices: body.devices,
            });
            res.status(200).json(result);
        } catch (err: any) {
            console.log(err);
            if (err.code === 11000) {
                res.status(400).json({
                    error: `duplicate key '${
                        Object.keys(err.keyValue)[0]
                    }' with value ${Object.values(err.keyValue)[0]}`,
                });
            }
            if (err.errors)
                res.status(400).json({
                    errors: Object.entries(
                        err.errors as mongoose.Error.ValidatorError
                    ).map(([k, v]) => {
                        return `Parameter '${k}' with value '${v.value}' is not allowed`;
                    }),
                });
        }
        // }
    }
};

export const getAllStationDevices = async (req: Request, res: Response) => {
    const stationDevicesList = await StationDevices.find();
    if (!stationDevicesList.length)
        return res.status(204).json({ message: "no stationDevices" });

    res.status(200).json(stationDevicesList);
};
