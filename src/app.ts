import express from "express";
import initServer from "./server";
import bodyParser from "body-parser";
import cors from "cors";
import * as timesyncServer from "timesync/server/index.js";
import dbConnect from "./config/dbConnect";
import liveApp from "./live";

const app = express();

dbConnect();

app.use(
    cors({
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: process.env.CORS_ALLOWED_ORIGIN?.split(",") as string[],
    })
);

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/timesync", timesyncServer.requestHandler);

// Start App

const server = initServer(app);
try {
    liveApp.start(app, server, "/live");
} catch (err) {
    console.error(err);
}

// wod 1 MT
import router from "./mtWod1/routes";
app.use("/wod1", router);

// wod Max MT
import routerMax from "./mtWodMax/routes";
app.use("/wodMax", routerMax);

// vote
import routerVote from "./vote/routes";
app.use("/vote", routerVote);

// wod Gym
import routerGym from "./mtWodGym/routes";
app.use("/wodGym", routerGym);
// try {
//     WOD1App.start(app, server, "/wod1");
// } catch (err) {
//     console.error(err);
// }
