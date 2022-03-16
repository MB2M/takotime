import MqttClient from "./MqttClient.js";
import MqttBroker from "./MqttBroker.js";
import { JsonDB } from "node-json-db";
import { Subscription } from "aedes";
import { EventEmitter } from "events";
import ForTime from "./wods/ForTime.js";
import BaseLiveWod from "./wods/BaseLiveWod.js";
import { WodType } from "../libs/WodType.js";

class LiveWodManager extends EventEmitter {
    mqttBroker?: MqttBroker;
    mqttClient?: MqttClient;
    timeOuts: NodeJS.Timeout[];
    stationDevicesDb?: JsonDB;
    wod?: BaseLiveWod;

    constructor() {
        super();
        this.timeOuts = [];
    }

    initBroker(port: number, databaseUrl?: string, start?: boolean) {
        this.mqttBroker = new MqttBroker(port, databaseUrl, start);
    }

    initMqttClient(options: object) {
        this.mqttClient = new MqttClient(options);
    }

    newWod(wodType: WodType, db: JsonDB) {
        if (wodType === WodType.ForTime) {
            this.wod = new ForTime(db);
        }
    }

    resetWod() {
        this.wod?.reset();
    }

    startWod(options: object) {
        this.wod?.start(options);
    }

    subscribeTopic(topicName: string | string[]) {
        this.mqttClient?.client.subscribe(topicName);
    }

    // Send config when a station connect
    initDefaultStationSub() {
        this.mqttBroker?.socket.on(
            "subscribe",
            (subscriptions: Subscription[]) => {
                if (subscriptions[0]?.topic === "server/wodConfig") {
                    this.sendFullConfig("server/wodConfig");
                    // this.sendToChannel("server/wodConfig");
                }
            }
        );
    }

    sendFullConfig(channel: string) {
        const msg = JSON.parse(JSON.stringify(this.wod?.db.getData("/")));

        msg.stations = msg.stations.map((s: any) => {
            const index = this.stationDevicesDb?.getIndex(
                "/stationDevices",
                s.lane_number,
                "lane_number"
            );

            if (typeof index !== "undefined" && index > -1) {
                const stationDevice = this.stationDevicesDb?.getData(
                    `/stationDevices[${index}]`
                );
                s.configs = {
                    station_ip: stationDevice?.station_ip,
                    devices: stationDevice?.devices,
                };
            }
            return s;
        });

        try {
            this.mqttClient?.client.publish(channel, JSON.stringify(msg), {
                qos: 1,
            });
        } catch (error) {
            console.error(error);
        }
    }

    // subsribe to receive data from stations
    // call the updatedb if wod is running
    initDefaultMessageReceipt() {
        this.subscribeTopic("station/wodData");
        this.mqttClient?.client.on("message", (topic, message) => {
            if (topic === "station/wodData") {
                const msg = JSON.parse(message.toString());
                if (msg.topic === "blePeripheral") {
                    const index = this.stationDevicesDb?.getIndex(
                        "/stationDevices",
                        msg.data.configs.station_ip,
                        "station_ip"
                    );

                    this.stationDevicesDb?.push(
                        `/stationDevices[${index}]/devices`,
                        msg.data.configs.devices
                    );
                    this.emit("station/deviceUpdated");
                } else {
                    this.wod?.update(JSON.parse(message.toString()));
                }
            }
        });
    }

    sendToChannel(
        channel: string,
        dbPath: string = "/",
        message?: string
    ): void {
        try {
            let msg =
                message || dbPath[0] !== "/"
                    ? message
                    : JSON.stringify(this.wod?.db.getData(dbPath));
            this.mqttClient?.client.publish(channel, msg as string, {
                qos: 1,
            });
        } catch (error) {
            console.error(error);
        }
    }

    publishRank() {
        const stationRanked = this.wod?.getWodRank();
        this.emit("rank", stationRanked);
        // this.sendToChannel("server/rank", JSON.stringify(stationRanked));
        // console.log(JSON.stringify(stationRanked));
    }

    clearAlltimeout() {
        this.timeOuts?.forEach(clearTimeout);
    }

    chronoData() {
        const start =
            Date.parse(this.wod?.db.getData("/globals/startTime")) / 1000;
        const end =
            (Date.parse(this.wod?.db.getData("/globals/startTime")) +
                this.wod?.db.getData("/globals/duration") * 60000) /
            1000;

        return JSON.stringify({
            startTime: start,
            endTime: end,
        });
    }

    initDefaultManagerSub(): void {
        this.wod?.on("wodUpdate", (type) => {
            console.log(`wod ${type}`);

            switch (type) {
                case "cooldown":
                    this.sendToChannel("server/wodGlobals", "/globals");
                    this.mqttClient?.client.publish(
                        "server/chrono",
                        this.chronoData(),
                        {
                            qos: 1,
                        }
                    );
                    break;
                case "start":
                    this.sendToChannel("server/wodGlobals", "/globals");
                    const rankInterval = setInterval(() => {
                        this.publishRank();
                    }, 300);
                    this.timeOuts?.push(rankInterval);
                    break;
                case "finish":
                    this.sendToChannel("server/wodGlobals", "/globals");
                    this.clearAlltimeout();
                    break;
                case "reset":
                    this.clearAlltimeout();
                    this.sendToChannel("server/wodConfigUpdate");
                    this.mqttClient?.client.publish(
                        "server/chrono",
                        this.chronoData(),
                        {
                            qos: 1,
                        }
                    );
                    break;
                default:
                    break;
            }
        });
    }

    setDevicesDb(db: JsonDB): void {
        this.stationDevicesDb = db;
    }

    setDevices(stationDevices: StationDevices[]) {
        if (this.stationDevicesDb) {
            this.stationDevicesDb.push("/stationDevices", stationDevices);
        }
        this.emit("setDevices");
        this.sendFullConfig("server/wodConfigUpdate");
    }
}

export default LiveWodManager;
