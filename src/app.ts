import express from "express";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import LiveWodManager from "./utils/livewod/LiveWodManager.js";
import ForTime from "./utils/livewod/wods/ForTime.js";
import WebSocket, { WebSocketServer } from "ws";
import cors from "cors";
import * as timesyncServer from "timesync/server/index.js";

dotenv.config();

const port = 3000;
const app = express();
const MONGO_AEDES_URL = process.env.MONGO_AEDES_URL as string;

// livedata DB
const db = new JsonDB(new Config("./liveconfig", true, false, "/"));
global.liveWodManager = new LiveWodManager();
global.liveWodManager.initBroker(8081, MONGO_AEDES_URL, true);

//MQTT Client
const options = {
    username: process.env.BROKER_USERNAME as string,
    password: process.env.BROKER_PASSWORD as string,
    clean: false,
    clientId: "mqttjs_TAKOTIME_SERVER",
};

// TODO: REMOVE this line
global.liveWodManager.wod = new ForTime(db);

global.liveWodManager.initMqttClient(options);
global.liveWodManager.initDefaultStationSub();
global.liveWodManager.initDefaultMessageReceipt();
global.liveWodManager.initDefaultManagerSub();

// Mangoose connection
mongoose.connect("mongodb://localhost/db", (err) => {
    console.log(err ? "Error while DB connecting" : "Connected to mongoDB");
});

app.use(
    cors({
        origin: process.env.CORS_ALLOWED_ORIGIN?.split(",") as string[],
    })
);

// configures body parser to parse JSON
app.use(bodyParser.json());
// configures body parser to parse url encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// handle timesync requests
app.use("/timesync", timesyncServer.requestHandler);

// Start App
app.use("/", routes);
const server = app.listen(port);
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        const json = JSON.parse(data.toString());
        const topic = json.topic;
        const message = json.message;
        if (topic === "client/scriptReset") {
            console.log("scriptReset");
            global.liveWodManager.sendToChannel(
                "server/scriptReset",
                null,
                message
            );
        }
        if (topic === "client/restartUpdate") {
            global.liveWodManager.sendToChannel(
                "server/restartUpdate",
                null,
                message
            );
        }
    });
    sendStationDataToAllClients();
    sendStationStatusToAllClients();
    sendGlobalsToAllClients();
});

global.liveWodManager.wod.on("station/updated", () => {
    sendStationDataToAllClients();
});

global.liveWodManager.wod.on("wodUpdate", (type: string) => {
    sendGlobalsToAllClients();
    if (type === "reset") {
        sendStationDataToAllClients();
    }
});

global.liveWodManager.mqttBroker.socket.on("clientReady", (client: any) => {
    sendStationStatusToAllClients();
});

global.liveWodManager.mqttBroker.socket.on("clientDisconnect", () => {
    sendStationStatusToAllClients();
});

global.liveWodManager.on("rank", (stationRanked: StationRanked) => {
    sendToAllClients("rank", stationRanked || "");
});

const sendStationDataToAllClients = () => {
    sendToAllClients(
        "stationUpdate",
        global.liveWodManager.wod.db.getData("/stations")
    );
};

const sendGlobalsToAllClients = () => {
    sendToAllClients(
        "globalsUpdate",
        global.liveWodManager.wod.db.getData("/globals")
    );
};

const sendStationStatusToAllClients = () => {
    let clients = {};
    Object.entries(
        global.liveWodManager.mqttBroker.socket.clients as object
    ).forEach(([k, v]) => {
        clients = { ...clients, [k]: v.connected };
    });

    sendToAllClients("brokerUpdate", clients);
};

const sendToAllClients = (topic: string, data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    topic: topic,
                    data: data,
                })
            );
        }
    });
};
