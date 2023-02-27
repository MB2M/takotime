import { Request, Response } from "express";
import loadFromLocal from "../../../services/loadLocalService";

const loaderLocal = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.event)
        return res.status(400).json({ message: "event parameters is missing" });

    if (!body.workout)
        return res
            .status(400)
            .json({ message: "workout parameters is missing" });

    if (!body.heat)
        return res.status(400).json({ message: "heat parameters is missing" });

    // const liveWodManager = global.liveWodManager;

    try {
        loadFromLocal(body.event, body.workout, body.heat);
        res.status(200).json({ message: "loaded" });
    } catch (err) {
        res.status(400).send(`An error occured:${err}`);
    }

    //CRER LOADERCC SERVICE

    // if (action === "start") {
    //     const startTime = new Date(
    //         Math.floor((Date.now() + countdown * 1000) / 1000) * 1000
    //     );
    //     try {
    //         liveWodManager.startWod({
    //             duration: duration,
    //             startTime: startTime,
    //         });
    //         res.status(200).json({
    //             startTime: startTime.toString(),
    //             duration: duration,
    //             countdown: countdown,
    //         });
    //     } catch (error) {
    //         res.status(400).send(`An error occured:${error}`);
    //     }
    // } else if (action === "reset") {
    //     try {
    //         await liveWodManager.resetWod();
    //         res.status(200).send(`Wod Reseted`);
    //     } catch (error) {
    //         res.status(400).send(`An error occured:${error}`);
    //     }
    // } else {
    //     res.end();
    // }
};

export default loaderLocal;
