import { Express } from "express";
import config from "./config";
import { WebSocketServer } from "ws";

const port = config.serverPort;

const initServer = (app: Express) => {
    const server = app.listen(port);
    return new WebSocketServer({ server });
};

export default initServer;
