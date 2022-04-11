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
