import { Request, Response } from "express";
import {
    deleteAll,
    update,
    viewStation,
    viewStations,
} from "../services/stationService";

export async function getStations(req: Request, res: Response) {
    const { heatId } = req.query;
    if (!heatId) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const stations = await viewStations(heatId as string);
            res.status(200).json(stations);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function getStation(req: Request, res: Response) {
    const { laneNumber } = req.params;
    const { heatId } = req.query;

    if (!laneNumber || !heatId) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const station = await viewStation(
                heatId as string,
                Number(laneNumber)
            );
            res.status(200).json(station);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function updateScore(req: Request, res: Response) {
    const body = req.body;
    const { heatId } = req.query;
    const { laneNumber } = req.params;


    if (!heatId) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const station = await update(
                body,
                heatId as string,
                Number(laneNumber)
            );
            if (!!station) {
                res.status(202).json(station);
            } else {
                res.status(404).json("station not found");
            }
        } catch (err: any) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

// export async function addScore(req: Request, res: Response) {
//     const body = req.body;
//     const { laneNumber } = req.params;
//     const { heatId } = req.query;

//     if (!heatId || !laneNumber) {
//         res.status(401).json({ error: "unauthorized" });
//     } else {
//         try {
//             const station = await add(
//                 body,
//                 heatId as string,
//                 Number(laneNumber)
//             );

//             if (!!station) {
//                 res.status(202).json(station);
//             } else {
//                 res.status(404).json("station not found");
//             }
//         } catch (err: any) {
//             console.log(err);
//             res.status(400).json({ error: "bad request" });
//         }
//     }
// }

export async function resetAll(req: Request, res: Response) {
    await deleteAll();
    res.status(200).send("deleted all scores");
}
