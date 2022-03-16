import { Request, Response } from "express";
import * as dotenv from "dotenv";
// import LiveWodManager from "../../"
dotenv.config();

const toggle = (req: Request, res: Response) => {
    const action = req.query.action;
    const liveWodManager = global.liveWodManager;

    if (action === "toggle") {
        liveWodManager.mqttBroker.toggle();
        res.status(200).json({
            brokerStarted: liveWodManager.mqttBroker.started,
        });
    } else if (action === "clientToggle") {
        liveWodManager.mqttClient.toggle(() => {
            res.status(200).json({
                mqtt_client_connected: liveWodManager.mqttClient.connected,
            });
        });
    } else {
        res.end();
    }
};

export default toggle;
