import { Request, Response } from "express";
import loadFromCC from "../../utils/loadCCService";

const loaderCC = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.workout || !body.heat)
        return res
            .status(400)
            .json({ message: "'workout and/or heat' parameters are missing" });

    // const liveWodManager = global.liveWodManager;

    try {
        loadFromCC(body.event, body.workout, body.heat);
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

export default loaderCC;
