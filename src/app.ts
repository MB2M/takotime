import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import initServer from "./server";
import dbConnect from "./config/dbConnect";
import { loadRoute } from "./routing";
import { startLiveApp } from "./live";
import logger from "./config/logger";

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

// process.on("uncaughtException", (err) => {
//     logger.fatal(err, "uncaught exception detected");
//     wss.close(() => {
//         process.exit(1);
//     });
//
//     // If a graceful shutdown is not achieved after 1 second,
//     // shut down the process completely
//     setTimeout(() => {
//         process.abort();
//     }, 1000).unref();
//     process.exit(1);
// });

await dbConnect();

// const liveSystems = new LiveSystemFactory({ wss, mqttClient });
// liveSystems.get("default");
// Start App

export const liveApp = startLiveApp(wss);

// this.mqttService.registerListener(
//     "station/connection",
//     async (message) => {
//         await this.liveSystemService.onStationConnection(message);
//     }
// );
//
// this.mqttService.registerListener("station/buzz", async (message) => {
//     try {
//         await this.liveSystemService.onStationBuzz(message);
//     } catch (error: any) {
//         logger.error(error);
//     }
// });
//
// this.mqttService.registerConnectListener(async () => {
//     await this.liveSystemService.onServerConnection();
// }, true);

//
// try {
//     onConnection();
//     new WebsocketScoringService(wss);
// } catch (err) {
//     console.error(err);
// }
