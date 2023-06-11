import express from "express";
import { authenticateToken } from "../../../../middleware/auth.js";
import broker from "./broker";
import login from "./login";
import signup from "./signup";
import switchStart from "./switchStart";
import * as stationDevicesController from "../../controllers/stationDevicesController";
import * as stationStaticsController from "../../controllers/stationController";
import * as workoutController from "../../controllers/workoutController";
import loaderCC from "./loaderCC.js";
import loaderTournament from "./loaderTournament";
import loaderLocal from "./loaderLocal";
import { getResults } from "../../controllers/resultController";
import { getCCToken } from "../../controllers/CCTokenController";

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
api.get("/cc-token", getCCToken);
api.post("/loadworkout", workoutController.loadWorkout);
api.post("/loadCC", loaderCC);
api.post("/loadTournament", loaderTournament);
api.post("/loadLocal", loaderLocal);
api.route("/results").get(getResults);
// api.post("/setWod", setWod);
// api.post("/setDevices", setDevices);
export default api;
