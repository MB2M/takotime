import express from "express";
import {
    createCompetition,
    getAllCompetitions,
    getCompetition,
    updateCompetition,
    removeCompetition,
    removeAllCompetition,
    selectCompetition,
} from "../controllers/competitionController";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "..", "public")));
router.post("/competition/", createCompetition);
router.get("/competition/", getAllCompetitions);
router.get("/competition/:id", getCompetition);
router.put("/competition/:id", updateCompetition);
router.get("/competition/:id/select", selectCompetition);
router.delete("/reset/:id", removeCompetition);
router.delete("/reset/", removeAllCompetition);

export default router;
