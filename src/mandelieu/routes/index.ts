import express from "express";
import {
    getStation,
    updateScore,
    getStations,
    resetAll,
} from "../controllers/stationController";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "..", "public")));
router.get("/station/", getStations);
router.get("/station/:laneNumber", getStation);
router.put("/station/:laneNumber", updateScore);
router.delete("/reset", resetAll);

export default router;
