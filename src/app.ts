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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/timesync", timesyncServer.requestHandler);

// Start App

const server  = initServer(app);
liveApp.start(app, server, "/live");
