import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import { onConnection } from "./webapp/services/websocketService";
// import WebsocketScoringService from "./webapp/services/websocketScoringService";
import initServer from "./server";
import dbConnect from "./config/dbConnect";
import { loadRoute } from "./routing";
import { startLiveApp } from "./live";
import mqttConnect from "./live/libs/mqttConnect";
import logger from "./config/logger";
import MqttServices from "./live/services/mqttServices";
import { LiveSystemFactory } from "./services/LiveSystemFactory";

const server = express();
export const wss = initServer(server);
logger.info("server started");

server.use(
    cors({
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        // origin: process.env.CORS_ALLOWED_ORIGIN?.split(",") as string[],
        origin: "*",
    })
);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
loadRoute(server);

process.on("uncaughtException", (err) => {
    logger.fatal(err, "uncaught exception detected");
    wss.close(() => {
        process.exit(1);
    });

    // If a graceful shutdown is not achieved after 1 second,
    // shut down the process completely
    setTimeout(() => {
        process.abort();
    }, 1000).unref();
    process.exit(1);
});

await dbConnect();

// const liveSystems = new LiveSystemFactory({ wss, mqttClient });
// liveSystems.get("default");
// Start App

export const liveApp = startLiveApp(wss);
//
// try {
//     onConnection();
//     new WebsocketScoringService(wss);
// } catch (err) {
//     console.error(err);
// }
