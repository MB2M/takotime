import { MqttController } from "./live/mqtt/controller";
import logger from "./config/logger";
import { liveApp } from "./app";
import mqttService from "./services/mqtt.service";
import LiveSystem from "./live/libs/LiveSystem";

export const loadMqttRoute = (
    mqttServices: mqttService,
    liveApp: LiveSystem
) => {
    const mqttController = new MqttController(mqttServices);

    mqttController.registerOnConnect(() => liveApp.onServerConnection());

    mqttController.register("station/connection", async (message: any) => {
        try {
            await liveApp.onStationConnection(message);
        } catch (error: any) {
            logger.error(error);
        }
    });
    mqttController.register("station/buzz", async (message: any) => {
        try {
            await liveApp.onStationBuzz(message);
        } catch (error: any) {
            logger.error(error);
        }
    });

    mqttController.listen(liveApp, "started", "server");
    mqttController.listen(liveApp, "settings", "server");
};
