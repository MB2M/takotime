import EventEmitter from "events";
import MqttServices from "../services/mqttServices";
import { exec } from "child_process";
import LiveEventService from "../services/liveEvent.service";
import IpConfigService from "../services/ipConfig.service";
import logger from "../../config/logger";
import { baseMessageSchema, buzzMessageSchema } from "./zodSchema/buzzer";
import WodTimer from "../../lib/timer/WodTimer";

class LiveSystem extends EventEmitter {
    mqttServices: MqttServices;
    // keyv: Keyv;
    // websocketServices: WebsocketServices;
    // websocketMessages: WebSocketMessages;
    // buzzer;
    // private id: string;
    events: LiveEventService[] = [];
    private ipConfigService: IpConfigService;

    constructor(
        {
            mqttServices,
            ipConfigService,
        }: {
            mqttServices: MqttServices;
            ipConfigService: IpConfigService;
        } // keyv: Keyv // websocketServices: WebsocketServices
    ) {
        super();

        // this.id = id;
        // if (process.env.NODE_ENV !== "development") {
        //     // this.buzzer = new onoff.Gpio(23, "out", "both", {
        //     //     debounceTimeout: 5,
        //     // });
        //     this.buzzer = new pigpio.Gpio(23, {
        //         mode: pigpio.Gpio.OUTPUT,
        //         timeout: 5,
        //     });
        //     this.buzzer.pwmFrequency(100);
        // }
        // this.timer = timer;
        this.mqttServices = mqttServices;
        // this.keyv = keyv;
        // this.websocketServices = websocketServices;
        // this.websocketMessages = new WebSocketMessages(this.websocketServices);
        this.ipConfigService = ipConfigService;
        this.init();

        //TEST
        this.createEvent("testFloor");
        this.ipConfigService.updateStation({
            id: "1.9",
            floor: "testFloor",
            laneNumber: 3,
        });
    }

    async init() {
        this.mqttInit();
        // this.wodTimerEventSubscription();
        // this.addOnWebsocketMessageListener();
    }

    // async wodTimerEventSubscription() {
    //     const subscription = new WodTimerSubscription(this.wodTimerServices);
    //     subscription.load();
    // }

    buzz() {
        exec("sudo cvlc ~/buzzer.wav", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
        });
        // @ts-ignore
        // player({ player: "cvlc" }).play("~/buzzer.wav", function (err) {
        //     if (err) console.log(err);
        // });
    }

    async mqttInit() {
        this.mqttServices.registerConnectListener(() => {
            this.onServerConnection();
        }, true);

        this.mqttServices.registerListener(
            "station/connection",
            async (message) => {
                await this.onStationConnection(message);
            }
        );

        this.mqttServices.registerListener("station/buzz", async (message) => {
            try {
                await this.onStationBuzz(message);
            } catch (error: any) {
                logger.error(error);
            }
        });
    }

    private async onServerConnection() {
        this.mqttServices.send(`server/started`, `restarted`);
    }
    private async onStationConnection(message: unknown) {
        const { id } = baseMessageSchema.parse(message);
        const stationConfig = await this.ipConfigService.getStation(id);
        this.mqttServices.send(
            `server/settings/${id}`,
            JSON.stringify(stationConfig)
        );
    }

    private async onStationBuzz(message: unknown) {
        const { id, timestamp } = buzzMessageSchema.parse(message);

        const stationConfig = await this.ipConfigService.getStation(id);
        if (!stationConfig) throw new Error(`Station ${id} not found`);

        const { laneNumber, floor } = stationConfig;
        if (!laneNumber || !floor)
            throw new Error(`Station ${id} lane number and/or floor not setup`);

        this.event(floor).buzz(laneNumber, timestamp);
    }

    createEvent(floorId: string) {
        this.deleteEvent(floorId);
        const timer = new WodTimer();
        const event = new LiveEventService(timer, floorId);
        this.events.push(event);
        return event;
    }

    event(floorId: string) {
        const event = this.events.find((event) => event.floorId === floorId);
        if (!event) throw new Error(`Event ${floorId} not found`);
        return event;
    }

    private deleteEvent(floorId: string) {
        this.events = this.events.filter((event) => event.floorId !== floorId);
    }

    // addOnWebsocketMessageListener() {
    //     this.websocketServices.addOnMessage(async (data) => {
    //         const json = JSON.parse(data.toString());
    //         const topic = json.topic;
    //         const message = json.message;
    //         if (topic === "client/scriptReset") {
    //             console.log("scriptReset");
    //             this.mqttServices.send("server/scriptReset", message);
    //         }
    //         if (topic === "client/restartUpdate") {
    //             this.mqttServices.send("server/restartUpdate", message);
    //         }
    //         if (topic === "client/remoteWarmupHeat") {
    //             await this.keyv.set("remoteWarmupHeat", message);
    //             await this.websocketMessages.sendGlobalsToAllClients();
    //         }
    //         if (topic === "client/remoteFinaleAthlete") {
    //             await this.keyv.set("remoteFinaleAthlete", message);
    //             await this.websocketMessages.sendGlobalsToAllClients();
    //         }
    //     });
    // }
    //
    // async chronoData() {
    //     const startTime = await this.keyv.get("startTime");
    //     const duration = await this.keyv.get("duration");
    //     const start =
    //         // Date.parse(this.wod?.db.getData("/globals/startTime")) / 1000;
    //         Date.parse(await this.keyv.get("startTime"));
    //     const end = (Date.parse(startTime) + duration * 60000) / 1000;
    //     // const end =
    //     //     (Date.parse(this.wod?.db.getData("/globals/startTime")) +
    //     //         this.wod?.db.getData("/globals/duration") * 60000) /
    //     //     1000;
    //
    //     return {
    //         duration,
    //         startTime: start,
    //         endTime: end,
    //     };
    // }
    //
    // async updateDynamics(_topic: string, data: any) {
    //     try {
    //         await Station.updateOne(
    //             {
    //                 _id: data._id,
    //             },
    //             data,
    //             {
    //                 runValidators: true,
    //                 upsert: true,
    //             }
    //         );
    //         this.websocketMessages.sendStationsToAllClients();
    //     } catch (err) {
    //         console.log(err);
    //     }
    //
    //     if (
    //         (await this.keyv.get("saveResults")) &&
    //         data.dynamics.measurements.length > 0
    //     ) {
    //         try {
    //             // const externalEventId = await this.keyv.get("externalEventId");
    //             const externalHeatId = await this.keyv.get("externalHeatId");
    //             // const externalWorkoutId = await this.keyv.get(
    //             //     "externalWorkoutId"
    //             // );
    //             this.emit(
    //                 "updateResults",
    //                 externalHeatId,
    //                 data.laneNumber,
    //                 data.externalId,
    //                 data.dynamics.measurements
    //             );
    //
    //             // LOCAL
    //             // await Result.update(
    //             //     {
    //             //         eventId: externalEventId,
    //             //         heatId: externalHeatId,
    //             //         laneNumber: data.laneNumber,
    //             //     },
    //             //     {
    //             //         participant: data.participant,
    //             //         category: data.category,
    //             //         externalId: data.externalId,
    //             //         result: data.dynamics.measurements,
    //             //     },
    //             //     {
    //             //         upsert: true,
    //             //         setDefaultsOnInsert: true,
    //             //         runValidators: true,
    //             //     }
    //             //
    //
    //             // FIREBASE
    //             // await updateResult(externalEventId, externalWorkoutId, {
    //             //     participant: data.participant,
    //             //     category: data.category,
    //             //     heatId: externalHeatId,
    //             //     participantId: data.externalId,
    //             //     result: data.dynamics.measurements,
    //             // });
    //
    //             // DIRECT CC
    //             // let athleteScore: ScorePost = {
    //             //     score: 0,
    //             //     isCapped: false,
    //             //     id: data.externalId,
    //             //     secondaryScore: null,
    //             //     tiebreakerScore: null,
    //             //     scaled: false,
    //             //     didNotFinish: false,
    //             // };
    //             //
    //             // let score = data.dynamics.result.split("|")[0];
    //             //
    //             // athleteScore.isCapped = !score.includes(":");
    //             // if (score.includes(":")) {
    //             //     if (score.length <= 9) {
    //             //         score = `00:${score}`;
    //             //     }
    //             // } else {
    //             //     score = Number(score);
    //             // }
    //             //
    //             // athleteScore.score = score;
    //
    //             // const scorePayload: ScorePost[] = [athleteScore];
    //
    //             // await postScore(
    //             //     externalEventId,
    //             //     externalWorkoutId,
    //             //     scorePayload
    //             // );
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    // }
    //
    // async updateDevices(topic: string, data: any) {
    //     const topicArray = topic.split("/");
    //
    //     if (!topicArray[1] || !topicArray[2]) return;
    //     if (!["counter", "station", "board"].includes(topicArray[1])) return;
    //     if (typeof data !== "number") return;
    //
    //     try {
    //         await Device.updateOne(
    //             {
    //                 ref: topicArray[2],
    //                 role: topicArray[1],
    //             },
    //             { state: data },
    //             {
    //                 runValidators: true,
    //                 upsert: true,
    //             }
    //         );
    //         this.websocketMessages.sendDevicesToAllClients();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    //
    // async sendOnStationConnection(_topic: string, data: any) {
    //     console.log("send on station connection!");
    //
    //     //TODO: le buzzer n'aura pas l'info de sa ligne, il faut simplement lui
    //     // envoyer les données qui lui sont utile (exemple le rang, si workout fini, si participant a fini, ...)
    //
    //     const { ip, responseTopic } = data;
    //     if (!ip || !responseTopic) return;
    //
    //     const stationConfig = await this.getStationConfig(ip);
    //
    //     if (data.responseTopic) {
    //         try {
    //             this.mqttServices.send(
    //                 data.responseTopic,
    //                 JSON.stringify(stationConfig)
    //             );
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // }
    //
    // async updateStationDevices(ip: Ip) {
    //     try {
    //         ipSchema.parse(ip);
    //     } catch (error: any) {}
    //
    //     const laneNumber = getLaneNumber(ip);
    //
    //     const stationDevice = await StationDevices.findOne(
    //         { ip: data.configs.station_ip },
    //         "devices"
    //     ).exec();
    //     if (stationDevice) {
    //         stationDevice.devices = data.configs.devices;
    //         await stationDevice.save();
    //         await this.websocketMessages.sendStationDevicesToAllClients();
    //     }
    // }
    //
    // //start wod
    // async startWod(options: StartOptions) {
    //     await this.keyv.set("startTime", options.startTime);
    //     await this.keyv.set("duration", options.duration);
    //     await this.keyv.set("saveResults", options.saveResults);
    //     const externalWorkoutId = await this.keyv.get("externalWorkoutId");
    //     const externalHeatId = await this.keyv.get("externalHeatId");
    //     this.wodTimerServices.start(options);
    //
    //     this.emit("startWod", externalWorkoutId, externalHeatId, options.reset);
    //     if (options.saveResults) {
    //         const externalEventId = await this.keyv.get("externalEventId");
    //
    //         const stations = await Station.find().exec();
    //         await Promise.all(
    //             stations.map(async (s: any) => {
    //                 await Result.updateMany(
    //                     {
    //                         eventId: externalEventId,
    //                         heatId: externalHeatId,
    //                         laneNumber: s.laneNumber,
    //                     },
    //                     {
    //                         participant: s.participant,
    //                         category: s.category,
    //                         externalId: s.externalId,
    //                         result: s.dynamics.result || "",
    //                     },
    //                     {
    //                         upsert: true,
    //                         setDefaultsOnInsert: true,
    //                         runValidators: true,
    //                     }
    //                 );
    //                 await updateResult(externalEventId, externalWorkoutId, {
    //                     participant: s.participant,
    //                     category: s.category,
    //                     heatId: externalHeatId,
    //                     participantId: s.externalId,
    //                     result: s.dynamics.result || "",
    //                 });
    //
    //                 s.reset();
    //                 await s.save();
    //             })
    //         );
    //     }
    // }
    //
    // async resetWod() {
    //     await this.resetGlobals();
    //     await this.resetDynamics();
    //     this.wodTimerServices.reset();
    // }
    //
    // async resetDynamics() {
    //     const stations = await Station.find().exec();
    //     await Promise.all(
    //         stations.map(async (s: any) => {
    //             s.reset();
    //             await s.save();
    //         })
    //     );
    // }
    //
    // async resetGlobals() {
    //     await this.keyv.set("duration", 0);
    //     await this.keyv.set("startTime", "");
    //     await this.keyv.set("state", 0);
    // }
    //
    // async getGlobals() {
    //     return {
    //         duration: await this.keyv.get("duration"),
    //         startTime: await this.keyv.get("startTime"),
    //         externalEventId: await this.keyv.get("externalEventId"),
    //         externalHeatId: await this.keyv.get("externalHeatId"),
    //         externalWorkoutId: await this.keyv.get("externalWorkoutId"),
    //         state: await this.keyv.get("state"),
    //         remoteWarmupHeat: await this.keyv.get("remoteWarmupHeat"),
    //         remoteFinaleAthlete: await this.keyv.get("remoteFinaleAthlete"),
    //     };
    // }
    //
    // async sendGlobalsToChannel() {
    //     const globals = await this.getGlobals();
    //     try {
    //         this.mqttServices.send(
    //             "server/wodGlobals",
    //             JSON.stringify(globals)
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    //
    // clearAlltimeout() {
    //     this.timeOuts?.forEach(clearTimeout);
    // }
    //

    //
    // async sendFullConfig(channel: string) {
    //     let msg: any = {};
    //     msg.globals = await this.getGlobals();
    //     msg.stations = await Station.find().exec();
    //     msg.stations = await Promise.all(
    //         msg.stations.map(async (s: any) => {
    //             let station = JSON.parse(JSON.stringify(s));
    //             const stationDevice = await StationDevices.findOne(
    //                 { laneNumber: s.laneNumber },
    //                 "ip devices"
    //             ).exec();
    //
    //             if (stationDevice) {
    //                 station.configs = {
    //                     station_ip: stationDevice.ip,
    //                     devices: stationDevice.devices,
    //                 };
    //             }
    //             return station;
    //         })
    //     );
    //
    //     msg.workouts = await workoutServices.getLoadedWorkouts(this.keyv);
    //
    //     try {
    //         this.mqttServices.send(channel, JSON.stringify(msg));
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    //
    // async publishRank() {
    //     const measurements = await workoutServices.getMeasurements(this.keyv);
    //     const stationRanked = await rankingServices(measurements);
    //     this.websocketServices.sendToAllClients("rank", stationRanked || "");
    // }
    //
    // async loadWorkout(ids: string[]) {
    //     let errors: string[] = [];
    //     const workoutIds = await Promise.all(
    //         ids.map(async (id: string) => {
    //             const workout = await Workout.findOne({ customId: id }).exec();
    //
    //             if (workout) {
    //                 return workout._id;
    //             }
    //
    //             errors.push(`${id} is not a valid id`);
    //         })
    //     );
    //
    //     if (errors.length) return { errors: errors };
    //
    //     await this.keyv.set("workoutIds", workoutIds);
    //     this.websocketMessages.sendLoadedWorkoutsToAllClients();
    //     this.sendFullConfig("server/wodConfigUpdate");
    //
    //     return { message: "workouts loaded" };
    // }
    //
    // async devicesUpdate(data: any, type: "create" | "update" | "delete") {
    //     let stationDevices;
    //     switch (type) {
    //         case "create":
    //             stationDevices = await StationDevices.create(data);
    //             break;
    //         case "update":
    //             stationDevices = await StationDevices.findByIdAndUpdate(
    //                 data.id,
    //                 data,
    //                 {
    //                     runValidators: true,
    //                 }
    //             ).exec();
    //             break;
    //         case "delete":
    //             stationDevices = await StationDevices.findByIdAndDelete(
    //                 data.id
    //             ).exec();
    //             break;
    //     }
    //
    //     this.websocketMessages.sendStationDevicesToAllClients();
    //     this.sendFullConfig("server/wodConfigUpdate");
    //
    //     return stationDevices;
    // }
    //
    // async workoutUpdate(data: any, type: "create" | "update" | "delete") {
    //     let workout;
    //     switch (type) {
    //         case "create":
    //             workout = await Workout.create(data);
    //             break;
    //         case "update":
    //             workout = await Workout.findOneAndUpdate(data.customId, data, {
    //                 runValidators: true,
    //             }).exec();
    //             break;
    //         case "delete":
    //             workout = await Workout.findOneAndDelete(
    //                 { customId: data.customId },
    //                 data.id
    //             ).exec();
    //             break;
    //     }
    //
    //     this.websocketMessages.sendActiveWorkoutListToAllClients();
    //
    //     return workout;
    // }
    //
    // async stationUpdate(
    //     data: any,
    //     type: "create" | "update" | "delete",
    //     update = true
    // ) {
    //     let station;
    //     switch (type) {
    //         case "create":
    //             station = await Station.create(data);
    //             break;
    //         case "update":
    //             station = await Station.findByIdAndUpdate(data.id, data, {
    //                 runValidators: true,
    //             }).exec();
    //             break;
    //         case "delete":
    //             station = await Station.findByIdAndDelete(data.id).exec();
    //             break;
    //     }
    //
    //     if (update) {
    //         this.websocketMessages.sendStationsToAllClients();
    //         this.sendFullConfig("server/wodConfigUpdate");
    //     }
    //
    //     this.emit("stationUpdate");
    //
    //     return station;
    // }
    //
    // async getAllStations() {
    //     return await Station.find().exec();
    // }
    //
    // async getAllStationDevices() {
    //     return await StationDevices.find().exec();
    // }
    //
    // async getAllDevices() {
    //     return await Device.find().exec();
    // }
    //
    // async getAllWorkouts() {
    //     return await Workout.find().exec();
    // }
    //
    // async getLoadedWorkouts() {
    //     return workoutServices.getLoadedWorkouts(this.keyv);
    // }
    //
    // async deleteAllStation() {
    //     await Station.deleteMany().exec();
    // }
    //
    // // async getAllBrokerClient() {
    // //     return this.mqttServices.getAllBrokerClients();
    // // }
    //
    // // async brokerClientUpdate(client: Client) {
    // //     this.websocketMessages.sendBrokerClientStatusToAllClients();
    // //     // this.websocketServices.sendToAllClients("brokerUpdate", client);
    // // }
    // public getId(id: string) {
    //     return this.id;
    // }
}

// const mqttServices = new MqttServices();
// const wodTimerServices = new WodTimer();
// const manager = new Manager(wodTimerServices, mqttServices);

export default LiveSystem;
