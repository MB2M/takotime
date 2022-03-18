import express from "express";
import { authenticateToken } from "../../../middleware/auth.js";
import broker from "./broker.js";
import login from "./login.js";
import signup from "./signup.js";
import switchStart from "./switchStart.js";
import setWod from "./setWod.js";
import setDevices from "./setDevices.js";
import * as stationDevicesController from "../../controllers/stationDevicesController";

const api = express.Router();

api.route("/stationdevices")
    .post(stationDevicesController.createDevice)
    .patch(stationDevicesController.updateDevice)
    .get(stationDevicesController.getAllStationDevices)
    .delete(stationDevicesController.deleteDevice);
api.get("/broker", authenticateToken, broker);
api.use("/login", login);
api.use("/signup", signup);
api.get("/switchStart", switchStart);
api.post("/setWod", setWod);
api.post("/setDevices", setDevices);
export default api;
