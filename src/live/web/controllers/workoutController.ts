import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import { liveApp } from "../../../app";

export const createWorkout: RequestHandler = async (
    req: Request,
    res: Response
) => {
    const body = req.body;

    try {
        const result = await liveApp.workoutUpdate(body, "create");
        res.status(200).json(result);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const updateWorkout = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.customId) {
        return res
            .status(400)
            .json({ message: "'customId' parameter is missing" });
    }

    try {
        const response = await liveApp.workoutUpdate(body, "update");
        res.status(200).json(response);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const deleteWorkout = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body?.customId) {
        return res
            .status(400)
            .json({ message: "'customId' parameter is missing" });
    }

    try {
        const response = await liveApp.workoutUpdate(body, "delete");
        res.status(200).json(response);
    } catch (err: any) {
        handleErrorDevice(err, res);
    }
};

export const getAllWorkouts = async (req: Request, res: Response) => {
    const stationStaticsList = await liveApp.getAllWorkouts();
    if (!stationStaticsList.length)
        return res.status(204).json({ message: "no stationDevices" });

    res.status(200).json(stationStaticsList);
};

export const loadWorkout = async (req: Request, res: Response) => {
    const customIdList = req.body.customId;

    if (!customIdList)
        res.status(400).json({ error: "'customId' parameter is missing" });

    try {
        const response = await liveApp.loadWorkout(customIdList);
        // const ids = await Promise.all(
        //     customIdList.map(async (id: string) => {
        //         const workout = await Workout.findOne({ customId: id }).exec();

        //         if (workout) {
        //             return workout._id;
        //         }
        //         res.status(400).json({ error: "one custom id is not valid" });
        //     })
        // )

        if (response.errors) {
            res.status(400).json(response);
        } else {
            res.status(200).json({ message: "workouts loaded" });
        }
    } catch (err) {
        console.log(err);
    }
};

const handleErrorDevice = (err: any, res: Response) => {
    if (err.code === 11000) {
        res.status(400).json({
            error: `duplicate key '${
                Object.keys(err.keyValue)[0]
            }' with value: ${Object.values(err.keyValue)[0]}`,
        });
    } else if (err.errors) {
        res.status(400).json({
            errors: Object.entries(
                err.errors as mongoose.Error.ValidatorError
            ).map(([k, v]) => {
                return `Parameter '${k}' with value '${v.value}' is not allowed`;
            }),
        });
    } else {
        res.status(400).json({ error: `invalid ${err.path}` });
    }
};
