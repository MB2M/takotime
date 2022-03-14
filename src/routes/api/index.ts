import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import broker from "./broker.js";
import login from "./login.js";
import signup from "./signup.js";
import switchStart from "./switchStart.js";
import setWod from "./setWod.js"
import setDevices from "./setDevices.js";

const api = express.Router();

api.get("/broker", authenticateToken, broker);
api.use("/login", login);
api.use("/signup", signup);
api.get("/switchStart", switchStart);
api.post("/setWod", setWod)
api.post("/setDevices", setDevices)
export default api;
