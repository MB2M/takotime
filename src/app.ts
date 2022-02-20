import express from "express";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import LiveWodManager from "./utils/livewod/LiveWodManager.js";
import ForTime from "./utils/livewod/wods/ForTime.js";

dotenv.config();

const port = 3000;
const app = express();
const MONGO_AEDES_URL = "mongodb://localhost/aedes";

// livedata DB
const db = new JsonDB(new Config("./liveconfig", true, true, "/"));
global.liveWodManager = new LiveWodManager();
global.liveWodManager.initBroker(8081, MONGO_AEDES_URL, true);

//MQTT Client
const options = {
    username: process.env.BROKER_USERNAME as string,
    password: process.env.BROKER_PASSWORD as string,
    clean: false,
    clientId: "mqttjs_TAKOTIME_SERVER",
};

global.liveWodManager.wod = new ForTime(db)
global.liveWodManager.initMqttClient(options);
global.liveWodManager.initDefaultStationSub();
global.liveWodManager.initDefaultMessageReceipt();
global.liveWodManager.initDefaultManagerSub()

// Mangoose connection
mongoose.connect("mongodb://localhost/db", (err) => {
    console.log(err ? "Error while DB connecting" : "Connected to mongoDB");
});

// configures body parser to parse JSON
app.use(bodyParser.json());
// configures body parser to parse url encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// Start App
app.use("/", routes);
app.listen(port);
