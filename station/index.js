import Station from "./Station.js";
import network from "network";
import * as dotenv from "dotenv";
dotenv.config();

const MQTT_URL = "mqtt://192.168.3.3:8081";

const mqttOptions = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
};

const main = async () => {
    network.get_private_ip(async (err, ip) => {
        console.log(err || ip);
        const station = new Station(ip);
        await station.getMqttClient(MQTT_URL, {
            ...mqttOptions,
            clientId: ip,
        });
        station.initMqtt();
    });
};

main().catch((error) => {
    console.log(error);
});
