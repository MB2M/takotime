import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import broker from "./broker.js";
import login from "./login.js";
import signup from "./signup.js";
import switchStart from "./switchStart.js";

const api = express.Router();

api.use("/broker", authenticateToken, broker);
api.use("/login", login);
api.use("/signup", signup);
api.use("/switchStart", authenticateToken, switchStart);
export default api;
