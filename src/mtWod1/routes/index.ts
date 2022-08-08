import express from "express";
import {
    createTournament,
    deleteTournament,
    getTournament,
    getTournaments,
    updateTournament,
} from "../controllers/tournamentController";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "..", "public")));
router.get("/tournaments", getTournaments);
router.get("/tournaments/:tournamentId", getTournament);
router.post("/tournaments", createTournament);
router.put("/tournaments/:tournamentId", updateTournament);
router.delete("/tournaments/:tournamentId", deleteTournament);
// router.post("/firebase", )


export default router;
