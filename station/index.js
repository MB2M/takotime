import Station from "./Station.js";
import network from "network";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
dotenv.config();

const MQTT_URL = process.env.MQTT_URL;

const mqttOptions = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: true,
    keepalive: 5,
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
        try {
            fs.unlinkSync("./livestation.json");
        } catch (err) {
            console.log(
                "error deleting livestation.json, file probably doesn't exist... if so ignore this error "
            );
        }
        const station = new Station(
            ip,
            MQTT_URL,
            {
                ...mqttOptions,
                reconnectPeriod: 1000,
                will: {
                    topic: `connected/station/${ip}`,
                    payload: "0",
                    qos: 1,
                    retain: true,
                },
            },
            [
                ...mqttTopics,
                `server/wodConfig/${ip}`,
                `buzzer/${this.ip.split(".")[3]}`,
            ]
        );
        station.initProcess();
    });
};

main().catch((error) => {
    console.log(error);
});
