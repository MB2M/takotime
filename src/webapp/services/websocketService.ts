import Competition from "../models/Competition";
import { WebSocket } from "ws";

import { wss } from "../../app";

const sendUpdate = async () => {
    const competition = await Competition.findOne({ selected: true }).exec();
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    topic: "competition",
                    data: competition,
                })
            );
        }
    });
};

const onConnection = () => {
    wss.on("connection", async (ws) => {
        sendUpdate();
    });
};

export { sendUpdate, onConnection };
