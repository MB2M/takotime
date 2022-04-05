import express from "express";
import initServer from "./server";
import liveRoutes from "./live/web/routes/index";
// import mongoose from "mongoose";
import bodyParser from "body-parser";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
// import LiveWodManager from "./live/utils/livewod/LiveWodManager";
import ForTime from "./live/utils/livewod/wods/ForTime";
import WebSocket, { WebSocketServer } from "ws";
import cors from "cors";
import * as timesyncServer from "timesync/server/index.js";
import dbConnect from "./config/dbConnect";
// import WebsocketSender from "./live/utils/livewod/WebsocketSender";
import brokerSubscription from "./live/utils/eventSubscriptions/brokerSubscriptions";
// import liveWodSubscription from "./live/utils/eventSubscriptions/livewodSubscriptions";
import wodSubscription from "./live/utils/eventSubscriptions/wodSubscriptions";
import liveApp from "./live";

import config from "./config";

// const port = 3000;
const app = express();

// const MONGO_AEDES_URL = process.env.MONGO_AEDES_URL as string;

// livedata DB
// const db = new JsonDB(new Config("./liveconfig", true, false, "/"));
// const stationDevicesDb = new JsonDB(
//     new Config("./liveDevices", true, false, "/")
// );

// global.liveWodManager = new LiveWodManager();
// global.liveWodManager.initBroker(8081, MONGO_AEDES_URL, true);
// global.liveWodManager.setDevicesDb(stationDevicesDb);

// TODO: REMOVE this line
// global.liveWodManager.wod = new ForTime(db);

// global.liveWodManager.initMqttClient(options);
// global.liveWodManager.initDefaultStationSub();
// global.liveWodManager.initDefaultMessageReceipt();
// global.liveWodManager.initDefaultManagerSub();

// Mangoose connection to MangoDB
dbConnect();

app.use(
    cors({
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: process.env.CORS_ALLOWED_ORIGIN?.split(",") as string[],
    })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/timesync", timesyncServer.requestHandler);

// Start App

const server  = initServer(app);
// const liveApp = new LiveApp(app, server);
liveApp.start(app, server, "/live");
// const server = app.listen(port);

// WEBSOCKET
// const wss = new WebSocketServer({ server });
// const sender = new WebsocketSender(wss);

// wodSubscription.load(global.liveWodManager.wod, sender);
// liveWodSubscription.load(global.liveWodManager, sender);
// // brokerSubscription.load(global.liveWodManager.mqttBroker.socket, sender);

// wss.on("connection", function connection(ws) {
//     ws.on("message", function message(data) {
//         const json = JSON.parse(data.toString());
//         const topic = json.topic;
//         const message = json.message;
//         if (topic === "client/scriptReset") {
//             console.log("scriptReset");
//             global.liveWodManager.sendToChannel(
//                 "server/scriptReset",
//                 null,
//                 message
//             );
//         }
//         if (topic === "client/restartUpdate") {
//             global.liveWodManager.sendToChannel(
//                 "server/restartUpdate",
//                 null,
//                 message
//             );
//         }
//     });
//     sender.sendStaticsToAllClients();
//     sender.sendStationStatusToAllClients();
//     sender.sendGlobalsToAllClients();
//     sender.sendStationDevicesToAllClients();
//     sender.sendWorkoutsToAllClients();
//     sender.sendLoadedWorkoutsToAllClients();
//     // sender.sendDynamicsToAllClients();
// });
