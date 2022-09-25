import { Request, Response } from "express";
import {
    create,
    getAll,
    get,
    remove,
    removeAll,
    update,
} from "../services/competitionService";

export async function getAllConfig(req: Request, res: Response) {
    try {
        const competitions = await getAll();
        res.status(200).json(competitions);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "bad request" });
    }
}

// export async function getCompetition(req: Request, res: Response) {
//     const { id } = req.params;

//     if (!id) {
//         res.status(401).json({ error: "unauthorized" });
//     } else {
//         try {
//             const competition = await get(id);
//             res.status(200).json(competition);
//         } catch (err) {
//             console.log(err);
//             res.status(400).json({ error: "bad request" });
//         }
//     }
// }

// export async function createCompetition(req: Request, res: Response) {
//     const data = req.body;

//     try {
//         const competition = await create(data);
//         res.status(200).json(competition);
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ error: "bad request" });
//     }
// }

// export async function updateCompetition(req: Request, res: Response) {
//     const { id } = req.params;
//     const body = req.body;

//     if (!id) {
//         res.status(401).json({ error: "unauthorized" });
//     } else {
//         try {
//             const competition = await update(id, body);
//             if (!!competition) {
//                 res.status(202).json(competition);
//             } else {
//                 res.status(404).json("station not found");
//             }
//         } catch (err: any) {
//             console.log(err);
//             res.status(400).json({ error: "bad request" });
//         }
//     }
// }

// export async function removeCompetition(req: Request, res: Response) {
//     const { id } = req.params;
//     if (!id) {
//         res.status(401).json({ error: "unauthorized" });
//     } else {
//         try {
//             await remove(id);
//             res.status(202).json("Competition Removed");
//         } catch (err: any) {
//             console.log(err);
//             res.status(400).json({ error: "bad request" });
//         }
//     }
// }

// export async function removeAllCompetition(req: Request, res: Response) {
//     try {
//         await removeAll();
//         res.status(200).send("deleted all scores");
//     } catch (err: any) {
//         console.log(err);
//         res.status(400).json({ error: "bad request" });
//     }
// }
