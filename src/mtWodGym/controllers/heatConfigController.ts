import { Request, Response } from "express";
import { viewAll, update, viewHeatConfig } from "../services/heatConfigService";

export async function getHeatsConfig(req: Request, res: Response) {
    try {
        const heats = await viewAll();
        res.status(200).json(heats);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "bad request" });
    }
}

export async function getHeatConfig(req: Request, res: Response) {
    const { heatId } = req.params;


    if (!heatId) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const heat = await viewHeatConfig(heatId as string);
            res.status(200).json(heat);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function updateHeatConfig(req: Request, res: Response) {
    const body = req.body;
    const { heatId } = req.params;


    if (!heatId) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const heat = await update(body, heatId as string);
            if (!!heat) {
                res.status(202).json(heat);
            } else {
                res.status(404).json("station not found");
            }
        } catch (err: any) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}
