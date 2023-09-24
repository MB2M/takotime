import Station from "./Station";
import network from "network";
import * as dotenv from "dotenv";
import { load as mqttLoad } from "./config/mqtt";
import { subIp } from "./utils/general";
dotenv.config();

const mqttTopics = [
    "server/wodConfig",
    "server/wodConfigUpdate",
    "server/wodGlobals",
    "server/scriptReset",
    "server/restartUpdate",
];

const main = async () => {
    const ip = await new Promise<string>((resolve) =>
        network.get_private_ip(async (err: any, ip: string) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            resolve(ip);
        })
    );

    const id = subIp(ip);

    const mqttService = mqttLoad(id);

    // network.get_private_ip(async (err: any, ip: string) => {
    const station = new Station(id, mqttService);
    //     await station.initProcess(
    //         MQTT_URL,
    //         {
    //             ...mqttOptions,
    //             reconnectPeriod: 1000,
    //             will: {
    //                 topic: `connected/station/${ip}`,
    //                 payload: "0",
    //                 qos: 1,
    //                 retain: true,
    //             },
    //         },
    //         [
    //             ...mqttTopics,
    //             `server/wodConfig/${ip}`,
    //             `buzzer/${ip.split(".")[3]}`,
    //         ]
    //     );
    // });
};

main().catch((error) => {
    console.log(error);
});
