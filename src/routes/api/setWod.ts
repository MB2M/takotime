import { Request, Response } from "express";

const setWod = (req: Request, res: Response) => {
    const wod = req.body.wod;
    if (!wod) res.status(400).send("bad request");

    const liveWodManager = global.liveWodManager;

    liveWodManager.wod.validateWod(wod, (error: string) => {
        if (error) return res.status(400).send(error);
    });
    
    try {
        liveWodManager.wod.setWod(wod)
    } catch (error) {
        return res.status(400).send(error);
    }

    res.send("wod updated");
};

export default setWod;
