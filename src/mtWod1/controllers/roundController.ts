import { Request, RequestHandler, Response } from "express";
import {
    newTournament,
    viewTournaments,
    changeTournament,
    viewTournament,
    delTournament,
} from "../services/tournamentService";

export async function getTournaments(req: Request, res: Response) {
    try {
        
        const tournaments = await viewTournaments();
        res.status(200).json(tournaments);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "bad request" });
    }
}

export async function getTournament(req: Request, res: Response) {
    const id = req.params.tournamentId;

    if (!id) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const tournament = await viewTournament(id);
            if (!!tournament) {
                res.status(200).json(tournament);
            } else {
                res.status(404).json("tournament not found");
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function createTournament(req: Request, res: Response) {
    const body = req.body;
    try {
        const tournament = await newTournament(body);
        res.status(201).json(tournament);
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ error: "bad request" });
    }
}

export async function updateTournament(req: Request, res: Response) {
    const body = req.body;
    const id = req.params.tournamentId;

    if (!id) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const tournament = await changeTournament(body, id as string);
            if (!!tournament) {
                res.status(202).json(tournament);
            } else {
                res.status(404).json("tournament not found");
            }
        } catch (err: any) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}

export async function deleteTournament(req: Request, res: Response) {
    const id = req.params.tournamentId;
    if (!id) {
        res.status(401).json({ error: "unauthorized" });
    } else {
        try {
            const tournament = await delTournament(id);
            if (!!tournament) {
                res.status(200).json(tournament);
            } else {
                res.status(404).json("tournament not found");
            }
        } catch (err: any) {
            console.log(err);
            res.status(400).json({ error: "bad request" });
        }
    }
}
