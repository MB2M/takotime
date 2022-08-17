import { Request, Response } from "express";
import loadFromTournament from "../../../services/loadTournamentService";

const loaderTournament = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.stations)
        return res
            .status(400)
            .json({ message: "stations parameters is missing" });

    // const liveWodManager = global.liveWodManager;

    try {
        loadFromTournament(body.stations, body.caategory);
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

export default loaderTournament;
