import { Request, Response } from "express";
import Validator from "../../utils/livewod/Validator";

const setDevices = (req: Request, res: Response) => {
    const devices = req.body;

    const liveWodManager = global.liveWodManager;

    Validator.devices(devices, (error: string) => {
        if (error) return res.status(400).send(error);
    });

    try {
        liveWodManager.setDevices(devices);
    } catch (error) {
        return res.status(400).send(error);
    }

    res.send("devices updated");
};

export default setDevices;
