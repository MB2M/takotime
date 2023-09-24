import { Request, Response } from "express";
import { liveApp } from "../../../../app";

const switchStart = async (req: Request, res: Response) => {
    const action = req.query.action;
    const duration = parseInt(req.query.duration as string, 10);
    const countdown = parseInt(req.query.countdown as string, 10);
    const saveResults = (req.query.save as string) === "true";
    const resetData = (req.query.reset as string) === "true";
    const liveWodManager = liveApp;

    if (action === "start") {
        // const startTime = new Date(
        //     Math.floor((Date.now() + countdown * 1000) / 1000) * 1000
        // );

        const startTime = new Date(Date.now() + countdown * 1000);
        try {
            await liveWodManager.startWod({
                duration,
                startTime,
                countdown,
                saveResults,
                reset: resetData,
            });
            res.status(200).json({
                startTime: startTime.toString(),
                duration: duration,
                countdown: countdown,
            });
        } catch (error) {
            res.status(400).send(`An error occurred:${error}`);
        }
    } else if (action === "reset") {
        try {
            await liveWodManager.resetWod();
            res.status(200).send(`Wod Reseted`);
        } catch (error) {
            res.status(400).send(`An error occured:${error}`);
        }
    } else {
        res.end();
    }
};

export default switchStart;
