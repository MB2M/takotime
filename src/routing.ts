import webappRouter from "./webapp/routes";
import { Express } from "express";
import * as timesyncServer from "timesync/server/index";
import liveRouter from "./live/web/routes";

export const loadRoute = (app: Express) => {
    app.use("/webapp", webappRouter);
    app.use("/live", liveRouter);
    app.use("/timesync", timesyncServer.requestHandler);
};
