import EventEmitter from "events";
import Keyv from "keyv";
import WodTimerSubscription from "./WodTimerSubscription";
import MqttServices from "../services/mqttServices";
import WodTimerServices from "../services/WodTimerServices";
import StationDevices from "../models/StationDevices";
import Workout from "../models/Workout";
import workoutServices from "../services/workoutServices";
import rankingServices from "../services/rankingServices";
import WebsocketServices from "../services/websocketServices";
import Station from "../models/Station";
import WebSocketMessages from "../services/websocketMessages";
import Device from "../models/Device";

class Manager extends EventEmitter {
    topics = [
        "station/blePeripheral",
        "station/generic",
        "station/connection",
        "board/connected/#",
        "connected/#",
    ];

    wodTimerServices: WodTimerServices;
    mqttServices: MqttServices;
    keyv: Keyv;
    timeOuts: NodeJS.Timeout[];
    websocketServices: WebsocketServices;
    websocketMessages: WebSocketMessages;

    constructor(
        wodTimerServices: WodTimerServices,
        mqttServices: MqttServices,
        keyv: Keyv,
        websocketServices: WebsocketServices
    ) {
        super();
        this.wodTimerServices = wodTimerServices;
        this.mqttServices = mqttServices;
        this.keyv = keyv;
        this.websocketServices = websocketServices;
        this.websocketMessages = new WebSocketMessages(this.websocketServices);
        this.timeOuts = [];
        this.init();
    }

    async init() {
        this.mqttInit();
        this.wodTimerEventSubscription();
        this.addOnWebsocketMessageListener();
    }

    async wodTimerEventSubscription() {
        const subscription = new WodTimerSubscription(this.wodTimerServices);
        subscription.load();
    }

    async mqttInit() {
        this.mqttServices.subscribe(this.topics);
        this.mqttServices.registerListener(
            "station/blePeripheral",
            this.updateStationDevices.bind(this)
        );
        this.mqttServices.registerListener(
            "station/generic",
            this.updateDynamics.bind(this)
        );
        this.mqttServices.registerListener(
            "station/connection",
            this.sendOnStationConnection.bind(this)
        );

        this.mqttServices.registerListener(
            "connected/",
            this.updateDevices.bind(this)
        );
    }

    addOnWebsocketMessageListener() {
        this.websocketServices.addOnMessage((data) => {
            const json = JSON.parse(data.toString());
            const topic = json.topic;
            const message = json.message;
            if (topic === "client/scriptReset") {
                console.log("scriptReset");
                this.mqttServices.send("server/scriptReset", message);
            }
            if (topic === "client/restartUpdate") {
                this.mqttServices.send("server/restartUpdate", message);
            }
            if (topic === "client/remoteWarmupHeat") {
                this.keyv.set("remoteWarmupHeat", message);
                this.websocketMessages.sendGlobalsToAllClients();
            }
            if (topic === "client/remoteFinaleAthlete") {
                this.keyv.set("remoteFinaleAthlete", message);
                this.websocketMessages.sendGlobalsToAllClients();
            }
        });
    }

    async chronoData() {
        const startTime = await this.keyv.get("startTime");
        const duration = await this.keyv.get("duration");
        const start =
            // Date.parse(this.wod?.db.getData("/globals/startTime")) / 1000;
            Date.parse(await this.keyv.get("startTime")) / 1000;
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

    async updateDynamics(_topic: string, data: any) {
        console.log("update Dynamics");
        try {
            await Station.updateOne(
                {
                    _id: data._id,
                },
                data,
                {
                    runValidators: true,
                    upsert: true,
                }
            );
            this.websocketMessages.sendStationsToAllClients();
        } catch (err) {
            console.log(err);
        }
    }

    async updateDevices(topic: string, data: any) {
        const topicArray = topic.split("/");

        if (!topicArray[1] || !topicArray[2]) return;
        if (!["counter", "station", "board"].includes(topicArray[1])) return;
        if (typeof data !== "number") return;

        try {
            await Device.updateOne(
                {
                    ref: topicArray[2],
                    role: topicArray[1],
                },
                { state: data },
                {
                    runValidators: true,
                    upsert: true,
                }
            );
            this.websocketMessages.sendDevicesToAllClients();
        } catch (err) {
            console.log(err);
        }
    }

    async sendOnStationConnection(_topic: string, data: any) {
        console.log("send on station connection!");

        const { ip, responseTopic } = data;
        if (!ip || !responseTopic) return;

        const stationConfig = await this.getStationConfig(ip);

        if (data.responseTopic) {
            try {
                this.mqttServices.send(
                    data.responseTopic,
                    JSON.stringify(stationConfig)
                );
            } catch (error) {
                console.error(error);
            }
        }
    }

    async updateStationDevices(_topic: string, data: any) {
        const stationDevice = await StationDevices.findOne(
            { ip: data.configs.station_ip },
            "devices"
        ).exec();
        if (stationDevice) {
            stationDevice.devices = data.configs.devices;
            await stationDevice.save();
            this.websocketMessages.sendStationDevicesToAllClients();
        }
    }

    //start wod
    async startWod(options: StartOptions) {
        await this.keyv.set("startTime", options.startTime);
        await this.keyv.set("duration", options.duration);
        this.wodTimerServices.start(options);
    }

    async resetWod() {
        await this.resetGlobals();
        await this.resetDynamics();
        this.wodTimerServices.reset();
    }

    async resetDynamics() {
        const stations = await Station.find().exec();
        await Promise.all(
            stations.map(async (s:any) => {
                s.reset();
                await s.save();
            })
        );
    }

    async resetGlobals() {
        await this.keyv.set("duration", 0);
        await this.keyv.set("startTime", "");
        await this.keyv.set("state", 0);
    }

    async getGlobals() {
        return {
            duration: await this.keyv.get("duration"),
            startTime: await this.keyv.get("startTime"),
            externalEventId: await this.keyv.get("externalEventId"),
            externalHeatId: await this.keyv.get("externalHeatId"),
            externalWorkoutId: await this.keyv.get("externalWorkoutId"),
            state: await this.keyv.get("state"),
            remoteWarmupHeat: await this.keyv.get("remoteWarmupHeat"),
            remoteFinaleAthlete: await this.keyv.get("remoteFinaleAthlete"),
        };
    }

    async sendGlobalsToChannel() {
        const globals = await this.getGlobals();
        try {
            this.mqttServices.send(
                "server/wodGlobals",
                JSON.stringify(globals)
            );
        } catch (error) {
            console.error(error);
        }
    }

    clearAlltimeout() {
        this.timeOuts?.forEach(clearTimeout);
    }

    async getStationConfig(ip: string) {
        let msg: any = {};
        const globals = await this.getGlobals();

        const stationDevice = await StationDevices.findOne({ ip }).exec();
        let stations: any = await Station.findOne({
            laneNumber: stationDevice?.laneNumber,
        }).exec();
        if (stations) {
            stations = JSON.parse(JSON.stringify(stations));
            stations["configs"] = {
                station_ip: stationDevice?.ip,
                devices: stationDevice?.devices,
            };
        }
        const workouts = await workoutServices.getLoadedWorkouts(this.keyv);

        return { globals, stations, workouts };
    }

    async sendFullConfig(channel: string) {
        let msg: any = {};
        msg.globals = await this.getGlobals();
        msg.stations = await Station.find().exec();
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

        msg.workouts = await workoutServices.getLoadedWorkouts(this.keyv);

        try {
            this.mqttServices.send(channel, JSON.stringify(msg));
        } catch (error) {
            console.error(error);
        }
    }

    async publishRank() {
        const measurements = await workoutServices.getMeasurements(this.keyv);
        const stationRanked = await rankingServices(measurements);
        this.websocketServices.sendToAllClients("rank", stationRanked || "");
    }

    async loadWorkout(ids: string[]) {
        let errors: string[] = [];
        const workoutIds = await Promise.all(
            ids.map(async (id: string) => {
                const workout = await Workout.findOne({ customId: id }).exec();

                if (workout) {
                    return workout._id;
                }

                errors.push(`${id} is not a valid id`);
            })
        );

        if (errors.length) return { errors: errors };

        await this.keyv.set("workoutIds", workoutIds);
        this.websocketMessages.sendLoadedWorkoutsToAllClients();
        this.sendFullConfig("server/wodConfigUpdate");

        return { message: "workouts loaded" };
    }

    async devicesUpdate(data: any, type: "create" | "update" | "delete") {
        let stationDevices;
        switch (type) {
            case "create":
                stationDevices = await StationDevices.create(data);
                break;
            case "update":
                stationDevices = await StationDevices.findByIdAndUpdate(
                    data.id,
                    data,
                    {
                        runValidators: true,
                    }
                ).exec();
                break;
            case "delete":
                stationDevices = await StationDevices.findByIdAndDelete(
                    data.id
                ).exec();
                break;
        }

        this.websocketMessages.sendStationDevicesToAllClients();
        this.sendFullConfig("server/wodConfigUpdate");

        return stationDevices;
    }

    async workoutUpdate(data: any, type: "create" | "update" | "delete") {
        let workout;
        switch (type) {
            case "create":
                workout = await Workout.create(data);
                break;
            case "update":
                workout = await Workout.findByIdAndUpdate(data.id, data, {
                    runValidators: true,
                }).exec();
                break;
            case "delete":
                workout = await Workout.findByIdAndDelete(data.id).exec();
                break;
        }

        this.websocketMessages.sendActiveWorkoutListToAllClients();

        return workout;
    }

    async stationUpdate(data: any, type: "create" | "update" | "delete") {
        let station;
        switch (type) {
            case "create":
                station = await Station.create(data);
                break;
            case "update":
                station = await Station.findByIdAndUpdate(data.id, data, {
                    runValidators: true,
                }).exec();
                break;
            case "delete":
                station = await Station.findByIdAndDelete(data.id).exec();
                break;
        }

        this.websocketMessages.sendStationsToAllClients();
        this.sendFullConfig("server/wodConfigUpdate");

        return station;
    }

    async getAllStations() {
        return await Station.find().exec();
    }

    async getAllStationDevices() {
        return await StationDevices.find().exec();
    }

    async getAllDevices() {
        return await Device.find().exec();
    }

    async getAllWorkouts() {
        return await Workout.find().exec();
    }

    async getLoadedWorkouts() {
        return workoutServices.getLoadedWorkouts(this.keyv);
    }

    async deleteAllStation() {
        await Station.deleteMany().exec();
    }

    // async getAllBrokerClient() {
    //     return this.mqttServices.getAllBrokerClients();
    // }

    // async brokerClientUpdate(client: Client) {
    //     this.websocketMessages.sendBrokerClientStatusToAllClients();
    //     // this.websocketServices.sendToAllClients("brokerUpdate", client);
    // }
}

// const mqttServices = new MqttServices();
// const wodTimerServices = new WodTimerServices();
// const manager = new Manager(wodTimerServices, mqttServices);

export default Manager;
