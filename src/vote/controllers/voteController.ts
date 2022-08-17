import { Request, Response } from "express";
import { vote, getAll, resetAll, deleteAll } from "../services/voteService";

export async function voteForChoice(req: Request, res: Response) {
    const { choice } = req.params;


    if (!choice) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const choiced = await vote(choice as string);
            res.status(200).json(choiced);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function getAllVotes(req: Request, res: Response) {
    // const { choice } = req.query;
    // if (!choice) {
    //     res.status(401).json({ error: "unauthorized" });
    // } else {
    try {
        const votes = await getAll();
        res.status(200).json(votes);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "bad request" });
    }
    // }
}

export async function resetChoices(req: Request, res: Response) {
    await resetAll();
    res.status(200).send("reseted all choices");
}

export async function deleteChoices(req: Request, res: Response) {
    await deleteAll();
    res.status(200).send("deleted all choices");
}
