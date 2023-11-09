import { liveApp } from "../../../app";
import { RequestHandler } from "express";
import logger from "../../../config/logger";

export default class LiveController {
    loadEvent: RequestHandler = (req, res) => {
        const body = req.body;

        //TODO ZOD VALIDATION

        const { floorId, stations, config } = body;

        try {
            const event = liveApp.createEvent(floorId, stations, config);
            res.status(200).json({ success: true });
        } catch (err: any) {
            logger.error(err);
            res.status(500).json({ success: false, error: err.message });
        }
    };
}
