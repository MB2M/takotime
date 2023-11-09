import config from "../../config";
import * as mqtt from "mqtt";
import logger from "../../config/logger";
import MqttService from "../../services/mqtt.service";

const options: mqtt.IClientOptions = {
    username: config.brokerUsername,
    password: config.brokerPassword,
    clean: true,
    clientId: `TAKOTIME_SERVER_${Math.floor(Math.random() * 100)}`,
    keepalive: 5,
};

const mqttTopics = ["station/connection", "station/buzz", "connected/#"];

const client = mqtt.connect(`${config.mqttUrl}`, options);
client.on("connect", () => {
    logger.info("mqtt connected");
    client.subscribe(mqttTopics, { qos: 1 });
});
client.on("end", () => logger.info("mqtt Disconnected"));

const mqttServices = new MqttService(client, logger);

export default mqttServices;
