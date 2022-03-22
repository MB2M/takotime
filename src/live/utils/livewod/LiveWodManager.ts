import MqttClient from "./MqttClient.js";
import MqttBroker from "./MqttBroker.js";
import { JsonDB } from "node-json-db";
import { Subscription } from "aedes";
import { EventEmitter } from "events";
import ForTime from "./wods/ForTime.js";
import BaseLiveWod from "./wods/BaseLiveWod.js";
import { WodType } from "../libs/WodType.js";
import StationDevices from "../../models/StationDevices.js";
import keyvInstance from "../libs/keyvInstance.js";
import StationStatics from "../../models/StationStatics.js";
import Workout from "../../models/Workout.js";
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

    async resetWod() {
        await this.resetGlobals();
        this.wod?.reset();
    }

    async startWod(options: StartOptions) {
        await keyvInstance.set("startTime", options.startTime);
        await keyvInstance.set("duration", options.duration);
        await keyvInstance.set("countdown", options.countdown);
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

    async resetGlobals() {
        await keyvInstance.set("duration", 0);
        await keyvInstance.set("startTime", "");
    }

    async getGlobals() {
        return {
            duration: await keyvInstance.get("duration"),
            startTime: await keyvInstance.get("startTime"),
        };
    }

    async sendFullConfig(channel: string) {
        let msg = JSON.parse(JSON.stringify(this.wod?.db.getData("/")));
        msg.globals = await this.getGlobals();
        msg.stations = await StationStatics.find().exec();
        msg.stations = await Promise.all(
            msg.stations.map(async (s: any) => {
                let station = JSON.parse(JSON.stringify(s));
                const stationDevice = await StationDevices.findOne(
                    { laneNumber: s.laneNumber },
                    "ip devices"
                ).exec();

                if (stationDevice) {
                    station.configs = {
                        station_ip: stationDevice.ip,
                        devices: stationDevice.devices,
                    };
                }
                return station;
            })
        );

        const workoutIds = await keyvInstance.get("workoutId");
        const workouts = await Promise.all(
            workoutIds.map(async (id: string) => {
                try {
                    const workout = await Workout.findById(id).exec();
                    return workout;
                } catch (err) {
                    return;
                }
            })
        );
        msg.workouts = workouts;
        try {
            this.mqttClient?.client.publish(channel, JSON.stringify(msg), {
                qos: 1,
            });
        } catch (error) {
            console.error(error);
        }
        console.log("send!")
    }

    // subsribe to receive data from stations
    // call the updatedb if wod is running
    initDefaultMessageReceipt() {
        this.subscribeTopic("station/wodData");
        this.mqttClient?.client.on("message", async (topic, message) => {
            if (topic === "station/wodData") {
                const msg = JSON.parse(message.toString());

                if (msg.topic === "blePeripheral") {
                    const stationDevice = await StationDevices.findOne(
                        { ip: msg.data.configs.station_ip },
                        "devices"
                    ).exec();

                    if (stationDevice) {
                        stationDevice.devices = msg.data.configs.devices;
                        await stationDevice.save();
                    }
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

    async sendGlobalsToChannel() {
        const globals = await this.getGlobals();
        try {
            this.mqttClient?.client.publish(
                "server/chrono",
                JSON.stringify(globals),
                {
                    qos: 1,
                }
            );
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

    async chronoData() {
        const startTime = await keyvInstance.get("startTime");
        const duration = await keyvInstance.get("duration");
        const start =
            // Date.parse(this.wod?.db.getData("/globals/startTime")) / 1000;
            Date.parse(await keyvInstance.get("startTime")) / 1000;
        const end = (Date.parse(startTime) + duration * 60000) / 1000;
        // const end =
        //     (Date.parse(this.wod?.db.getData("/globals/startTime")) +
        //         this.wod?.db.getData("/globals/duration") * 60000) /
        //     1000;

        return JSON.stringify({
            startTime: start,
            endTime: end,
        });
    }

    initDefaultManagerSub() {
        this.wod?.on("wodUpdate", async (type) => {
            console.log(`wod ${type}`);

            switch (type) {
                case "countdown":
                    this.sendGlobalsToChannel();
                    // this.sendToChannel("server/wodGlobals", "/globals");
                    // this.mqttClient?.client.publish(
                    //     "server/chrono",
                    //     await this.chronoData(),
                    //     {
                    //         qos: 1,
                    //     }
                    // );
                    break;
                case "start":
                    this.sendGlobalsToChannel();
                    // this.sendToChannel("server/wodGlobals", "/globals");
                    const rankInterval = setInterval(() => {
                        this.publishRank();
                    }, 300);
                    this.timeOuts?.push(rankInterval);
                    break;
                case "finish":
                    this.sendGlobalsToChannel();
                    // this.sendToChannel("server/wodGlobals", "/globals");
                    this.clearAlltimeout();
                    break;
                case "reset":
                    this.clearAlltimeout();
                    this.sendFullConfig("server/wodConfigUpdate");
                    // this.mqttClient?.client.publish(
                    //     "server/chrono",
                    //     await this.chronoData(),
                    //     {
                    //         qos: 1,
                    //     }
                    // );
                    break;
                default:
                    break;
            }
        });
    }

    async loadWorkout(workoutId: string[]) {
        await keyvInstance.set("workoutId", workoutId);
        this.emit("loadWorkout");
        this.sendFullConfig("server/wodConfigUpdate");
    }

    setDevicesDb(db: JsonDB): void {
        this.stationDevicesDb = db;
    }

    devicesSet() {
        this.emit("setDevices");
        this.sendFullConfig("server/wodConfigUpdate");
    }

    stationStaticsSet() {
        this.emit("setStationStatics");
        this.sendFullConfig("server/wodConfigUpdate");
    }

    workoutSet() {
        this.emit("setWorkout");
    }
}

export default LiveWodManager;