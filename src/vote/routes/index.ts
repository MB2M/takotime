import express from "express";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { voteForChoice,  getAllVotes, resetChoices, deleteChoices } from "../controllers/voteController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "..", "public")));

router.get("/", getAllVotes);
router.post("/:choice", voteForChoice);
router.delete("/", resetChoices);
router.delete("/deleteAll", deleteChoices);

export default router;
