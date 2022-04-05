
import { Express } from "express";
import config from "./config";

const port = config.serverPort;

function initServer(app: Express) {
    const server = app.listen(port);

    return server;
}

export default initServer;
