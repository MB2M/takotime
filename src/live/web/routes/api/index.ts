import express from "express";
import { authenticateToken } from "../../../../middleware/auth.js";
import broker from "./broker";
import switchStart from "./switchStart";
import * as stationStaticsController from "../../controllers/stationController";
import * as workoutController from "../../controllers/workoutController";
import loaderCC from "./loaderCC.js";
import loaderTournament from "./loaderTournament";
import loaderLocal from "./loaderLocal";
import { getResults } from "../../controllers/resultController";
import { getCCToken } from "../../controllers/CCTokenController";
import { liveController } from "../../../index";

const api = express.Router();

api.post("/loadEvent", liveController.loadEvent);

// OLD ROUTES
// api.route("/stationstatics")
//     .post(stationStaticsController.createStation)
//     .patch(stationStaticsController.updateStation)
//     .get(stationStaticsController.getAllStation)
//     .delete(stationStaticsController.deleteStation);
// api.route("/workouts")
//     .post(workoutController.createWorkout)
//     .patch(workoutController.updateWorkout)
//     .get(workoutController.getAllWorkouts)
//     .delete(workoutController.deleteWorkout);
// api.get("/broker", authenticateToken, broker);
// api.get("/switchStart", switchStart);
// api.get("/cc-token", getCCToken);
// api.post("/loadworkout", workoutController.loadWorkout);
// api.post("/loadCC", loaderCC);
// api.post("/loadTournament", loaderTournament);
// api.post("/loadLocal", loaderLocal);
// api.route("/results").get(getResults);
// api.post("/setWod", setWod);
// api.post("/setDevices", setDevices);
export default api;
