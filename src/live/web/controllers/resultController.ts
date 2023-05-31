import { Request, Response } from "express";
import { viewResults } from "../../services/resultsService";

export const getResults = async (req: Request, res: Response) => {
    const { eventId, heatId } = req.query;

    if (!eventId || !heatId) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const results = await viewResults(eventId as string, heatId as string);

    res.status(200).json(results);
};
