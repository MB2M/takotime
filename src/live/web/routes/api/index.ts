import express from "express";
import { authenticateToken } from "../../../../middleware/auth.js";
import broker from "./broker.js";
import login from "./login.js";
import signup from "./signup.js";
import switchStart from "./switchStart.js";
import * as stationDevicesController from "../../controllers/stationDevicesController";
import * as stationStaticsController from "../../controllers/stationController";
import * as workoutController from "../../controllers/workoutController.js";
import loaderCC from "./loaderCC.js";
import loaderTournament from "./loaderTournament.js";

const api = express.Router();

api.route("/stationdevices")
    .post(stationDevicesController.createDevice)
    .patch(stationDevicesController.updateDevice)
    .get(stationDevicesController.getAllStationDevices)
    .delete(stationDevicesController.deleteDevice);
api.route("/stationstatics")
    .post(stationStaticsController.createStation)
    .patch(stationStaticsController.updateStation)
    .get(stationStaticsController.getAllStation)
    .delete(stationStaticsController.deleteStation);
api.route("/workouts")
    .post(workoutController.createWorkout)
    .patch(workoutController.updateWorkout)
    .get(workoutController.getAllWorkouts)
    .delete(workoutController.deleteWorkout);
api.get("/broker", authenticateToken, broker);
api.use("/login", login);
api.use("/signup", signup);
api.get("/switchStart", switchStart);
api.post("/loadworkout", workoutController.loadWorkout);
api.post("/loadCC", loaderCC);
api.post("/loadTournament", loaderTournament);
// api.post("/setWod", setWod);
// api.post("/setDevices", setDevices);
export default api;
