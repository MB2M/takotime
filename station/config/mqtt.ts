import * as mqtt from "mqtt";
import MqttServices from "../services/mqttServices";
import { subIp } from "../utils/general";

const MQTT_URL = process.env.MQTT_URL as string;

const mqttOptions: mqtt.IClientOptions = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    keepalive: 20,
};

const topics = ["server/+"];

const mqttConnect = (id: string) => {
    return mqtt.connect(MQTT_URL, {
        ...mqttOptions,
        clientId: id,
        will: {
            topic: `connected/station/${id}`,
            payload: "0",
            qos: 1,
            retain: true,
        },
    });
};

const topicsWithId = (id: string) => {
    return topics.flatMap((topic) => [topic, `${topic}/${id}`]);
};

export const load = (id?: string) => {
    id ??= Math.random().toString(36).substring(2, 15);
    const client = mqttConnect(id);
    return new MqttServices(client, topicsWithId(id));
};
