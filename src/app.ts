import express from "express";
import initServer from "./server";
import bodyParser from "body-parser";
import cors from "cors";
import * as timesyncServer from "timesync/server/index.js";
import dbConnect from "./config/dbConnect";
import liveApp from "./live";
import { WebSocket, WebSocketServer } from "ws";

const app = express();

dbConnect();

app.use(
    cors({
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        // origin: process.env.CORS_ALLOWED_ORIGIN?.split(",") as string[],
        origin: "*",
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
export const wss = new WebSocketServer({ server });
try {
    liveApp.start(app, server, wss, "/live");
} catch (err) {
    console.error(err);
}

// // wod 1 MT
// import router from "./mtWod1/routes";
// app.use("/wod1", router);

// wod Max
import routerMax from "./mtWodMax/routes";
app.use("/wodMax", routerMax);

// // vote
// import routerVote from "./vote/routes";
// app.use("/vote", routerVote);

// // wod Gym
// import routerGym from "./mtWodGym/routes";
// app.use("/wodGym", routerGym);

// mandelieu
import routerGym from "./mandelieu/routes";
app.use("/mandelieu", routerGym);

// webApp
import webappRouter from "./webapp/routes";
import { onConnection } from "./webapp/services/websocketService";
app.use("/webapp", webappRouter);
onConnection();

// try {
//     WOD1App.start(app, server, "/wod1");
// } catch (err) {
//     console.error(err);
// }
