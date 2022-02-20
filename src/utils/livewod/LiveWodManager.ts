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
    timeOuts?: NodeJS.Timeout[];
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
                    this.sendToChannel("server/wodConfig");
                }
            }
        );
    }
    // subsribe to receive data from stations
    // call the updatedb if wod is running
    initDefaultMessageReceipt() {
        this.subscribeTopic("station/wodData");
        this.mqttClient?.client.on("message", (topic, message) => {
            if (topic === "station/wodData") {
                this.wod?.update(JSON.parse(message.toString()));
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
            console.error();
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

        // this.wod?.on("wodCooldown", () => {
        //     console.log("cooldown");
        //     this.sendToChannel("server/wodGlobals", "/globals");
        //     this.mqttClient?.client.publish(
        //         "server/chrono",
        //         this.chronoData(),
        //         {
        //             qos: 1,
        //         }
        //     );
        // });
        // this.wod?.on("wodStart", () => {
        //     console.log("wod started");
        //     this.sendToChannel("server/wodGlobals", "/globals");
        //     const rankInterval = setInterval(() => {
        //         this.publishRank();
        //     }, 300);
        //     this.timeOuts?.push(rankInterval);
        // });
        // this.wod?.on("wodFinish", () => {
        //     this.clearAlltimeout();
        //     this.sendToChannel("server/wodGlobals", "/globals");
        // });

        // this.wod?.on("wodReset", () => {
        //     console.log("wod reseted!!");
        //     this.clearAlltimeout();
        //     this.sendToChannel("server/wodConfigUpdate");
        //     this.mqttClient?.client.publish(
        //         "server/chrono",
        //         this.chronoData(),
        //         {
        //             qos: 1,
        //         }
        //     );
        // });

        // this.on("resetWod", () => this.sendToChannel("server/wodConfigUpdate"));

        // this.on("wodUpdate", () =>
        //     this.sendToChannel("server/wodConfigUpdate")
        // );
    }
}

export default LiveWodManager;
