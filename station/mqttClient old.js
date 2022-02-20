import mqtt from "mqtt";
import * as dotenv from "dotenv";
dotenv.config();

const MQTT_URL = "mqtt://192.168.3.3:8081";

const options = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    clientId: "mqttjs_101",
};

const clientMqtt = mqtt.connect(MQTT_URL, options);

const topics = [
    "server/wodConfig",
    "server/wodConfigUpdate",
    "server/wodGlobals",
];

clientMqtt.on("connect", () => {
    console.log("connected");
    clientMqtt.subscribe(topics, { qos: 1 }, function (err) {
        if (err) console.log(err);
    });
});

export default clientMqtt

