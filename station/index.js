import Station from "./Station.js";
import network from "network";
import * as dotenv from "dotenv";
dotenv.config();

const MQTT_URL = process.env.MQTT_URL;

const mqttOptions = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
};

const mqttTopics = [
    "server/wodConfig",
    "server/wodConfigUpdate",
    "server/wodGlobals",
    "server/scriptReset",
    "server/restartUpdate",
];

const main = async () => {
    network.get_private_ip(async (err, ip) => {
        console.log(err || ip);
        const station = new Station(ip, MQTT_URL, mqttOptions, mqttTopics);
        station.initProcess();
    });
};

main().catch((error) => {
    console.log(error);
});
