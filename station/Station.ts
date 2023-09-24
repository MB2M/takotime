// import WodTimer from "./utils/WodTimer";
import onoff, { Gpio } from "onoff";
import * as dotenv from "dotenv";
import MqttServices from "./services/mqttServices";
import { StationSettingsSchema } from "./schemas/StationSettingsSchema";
import { StationSettings } from "./types/station";
import readline from "readline";

dotenv.config();

const GPIO_PIN = +(process.env.GPIO_PIN || 18);

class Station {
    private readonly id: string;
    private buzzTimestamps: number[] = [];
    private settings?: StationSettings;
    // private timer: WodTimer;
    private buzzer?: Gpio;
    private lastPress: number;
    private mqtt: MqttServices;
    constructor(id: string, mqttService: MqttServices) {
        this.id = id;
        // this.timer = new WodTimer();

        this.lastPress = 0;
        this.mqtt = mqttService;
        this.initMqttEventListener();

        if (process.env.NODE_ENV === "development") {
            readline.createInterface(process.stdin).on("line", (line) => {
                if (line === "b") this.onBuzzPress();
            });
        } else {
            this.buzzer = new onoff.Gpio(
                GPIO_PIN,
                "in",
                "both"
                //     {
                //     debounceTimeout: 3,
                // }
            );
            this.initButtons();
        }
    }

    private onSettings(settings: unknown) {
        try {
            this.settings = StationSettingsSchema.parse(settings);
        } catch (error: any) {
            console.error("Bad station settings:", settings);
            console.error(error.message);
        }
    }

    private connectionRequest() {
        this.mqtt.send(`station/connection`, JSON.stringify({ id: this.id }));
        this.mqtt.send(`connected/station/${this.id}`, JSON.stringify("1"));
    }

    private onBuzzPress(timestamp: number = Date.now()) {
        this.buzzTimestamps.push(timestamp);
        this.mqtt.send(
            `station/buzz`,
            JSON.stringify({ id: this.id, timestamp })
        );
    }

    private onAskBuzz() {
        this.mqtt.send(
            `station/buzzList`,
            JSON.stringify({ id: this.id, timestamps: this.buzzTimestamps })
        );
    }

    initMqttEventListener() {
        this.mqtt.registerListener(`server/settings/${this.id}`, (settings) =>
            this.onSettings(settings)
        );
        this.mqtt.registerListener(`server/started`, () =>
            this.connectionRequest()
        );
        this.mqtt.registerListener(`server/ask/buzz`, () => this.onAskBuzz());

        this.connectionRequest();

        // this.mqttClient.on("message", async (topic, message) => {
        //     console.log("Topic Received:", topic);
        //     if (topic === `server/wodConfig/${this.ip}`) {
        //         const json = JSON.parse(message.toString());
        //
        //         let myWorkout;
        //         for (const workout of json.workouts) {
        //             if (workout.categories.includes(json.stations?.category)) {
        //                 myWorkout = workout;
        //             }
        //         }
        //         json.workouts = myWorkout;
        //
        //         this.setStationWodConfig(json);
        //     }
        //
        //     if (
        //         topic === "server/wodConfig" ||
        //         topic === "server/wodConfigUpdate"
        //     ) {
        //         const json = JSON.parse(message.toString());
        //         const data = this.extractRelativesInfo(json);
        //         this.setStationWodConfig(data);
        //     }
        //
        //     if (topic === "server/wodGlobals") {
        //         const json = JSON.parse(message);
        //         if (this.isNewGlobals(json)) this.initTimer(json);
        //         this.db.push("/globals", json);
        //     }
        //
        //     if (topic === "server/scriptReset") {
        //         if (this.ip === message.toString()) {
        //             this.mqttClient.client.end();
        //             exec("pm2 restart 0", function (msg) {
        //                 console.log(msg);
        //             });
        //         }
        //     }
        //
        //     if (topic === "server/restartUpdate") {
        //         if (this.ip === message.toString()) {
        //             exec(
        //                 "cd && cd takotime && sudo git pull origin && pm2 restart all",
        //                 function (msg) {
        //                     console.log(msg);
        //                 }
        //             );
        //         }
        //     }
        //
        //
        //     if (topic === `buzzer/${this.ip.split(".")[3]}`) {
        //         if (this.db.getData("/stations/dynamics/state") === 2) {
        //             const now = parseInt(message);
        //
        //             if (now < this.lastPush + 20000) return;
        //
        //             this.lastPush = now;
        //
        //             this.wodInterpreter.pressBuzzer(
        //                 now,
        //                 Date.parse(this.db.getData("/globals/startTime")),
        //                 this.db.getData("/stations/dynamics/measurements"),
        //                 this.db.getData("/stations/dynamics/currentWodPosition")
        //             );
        //         }
        //     }
        // });
    }

    // initTimerEventListener() {
    //     this.timer.on("countdown", (value) => {
    //         console.log("WOD COUNTDOWN TIMER");
    //         try {
    //             const station = this.db.getData("/stations");
    //             if (station.dynamics.state !== 1) this.changeState(1);
    //         }
    //     });
    //
    //     this.timer.on("wodStarted", () => {
    //         console.log("WOD STARTED TIMER");
    //         this.lastPush = 0;
    //         this.changeState(2);
    //     });
    //
    //     this.timer.on("wodEnded", () => {
    //         console.log("WOD ENDED TIMER");
    //         this.changeState(3);
    //     });
    //
    //     this.timer.on("timeCheckpoint", (checkpoint) => {
    //         console.log("NEW CHECKPOINT: ", checkpoint);
    //         this.wodInterpreter.checkpoint(
    //             "timer",
    //             this.db.getData("/stations/dynamics/measurements"),
    //             this.db.getData("/globals/startTime"),
    //             checkpoint,
    //             this.db.getData("/stations/dynamics/currentWodPosition")
    //         );
    //     });
    // }
    //
    // isNewGlobals(globals) {
    //     try {
    //         const actual = this.db.getData("/globals");
    //         const actualStartTime = actual.startTime;
    //         const actualDuration = actual.duration;
    //
    //         return (
    //             actualStartTime !== globals.startTime ||
    //             actualDuration !== globals.duration
    //         );
    //     } catch (err) {
    //         return globals ? true : false;
    //     }
    // }
    //
    // setStationWodConfig(data) {
    //     if (data.stations?.dynamics) {
    //         data.stations.dynamics.appVersion =
    //             loadJsonFileSync("package.json").version;
    //
    //         // first time init
    //         if (!data.stations.dynamics.currentWodPosition) {
    //             data.stations.dynamics.currentWodPosition = {
    //                 block: 0,
    //                 round: 0,
    //                 movement: 0,
    //                 reps: 0,
    //                 repsPerBlock: [],
    //             };
    //         }
    //         if (!data.stations.dynamics.measurements) {
    //             data.stations.dynamics.measurements = [];
    //         }
    //     }
    //
    //     this.updateDB(data);
    //
    //     const newCounterMac = data.stations?.configs?.devices?.find(
    //         (device) => device.role === "counter"
    //     )?.mac;
    //     const newBoardMac = data.stations?.configs?.devices?.find(
    //         (device) => device.role === "board"
    //     )?.mac;
    //

    //
    //     // const devices = this.getRequiredDevices();
    //     // this.bleServices.connectTo(devices);
    //
    //     try {
    //         const loadedWorkout = this.db.getData("/workouts");
    //         console.log("LOADED WORKOUT", loadedWorkout);
    //         this.wodInterpreter.load(loadedWorkout);
    //         if (data.stations?.dynamics.state < 2) {
    //             this.wodInterpreter.getRepsInfo(
    //                 data.stations.dynamics.currentWodPosition
    //             );
    //             // save db
    //             this.db.save();
    //         }
    //         if (
    //             data.globals.duration !== 0
    //             // && data.stations.dynamics.result === ""
    //         ) {
    //             this.initTimer(data.globals);
    //         } else {
    //             this.timer && this.timer.stopTimer();
    //         }
    //     } catch (err) {
    //         console.error("No workout to load");
    //         console.error(err);
    //     }
    // }
    //
    initButtons() {
        this.buzzer?.watch((err, value) => {
            if (err) {
                throw err;
            }

            const now = Date.now();
            if (now < this.lastPress + 20000) return;

            this.lastPress = now;
            this.onBuzzPress(now);
        });

        process.on("SIGINT", (_) => {
            this.buzzer?.unexport();
        });
        console.log("BUZZER LOADED");
    }
    //
    // changeState(state) {
    //     if (this.timer && state === 3) this.timer.stopTimer();
    //
    //     this.db.push("/stations/dynamics/state", state);
    //
    //     //TODO: appeller un preparateur de message pour le serveur basé sur le state
    //     // Pour l'instant  le message est de type reps
    //
    //     //Publish to server
    //     this.sendToServer("station/generic");
    //
    // }
    //
    //
    //
    // initTimer(json) {
    //     const checkPointTime = this.wodInterpreter.getCheckpointTime();
    //     this.timer.stopTimer();
    //     this.timer.launchTimer(json.startTime, json.duration, checkPointTime);
    // }
    //
    // sendToServer(topic) {
    //     const station = this.db.getData("/stations");
    //     // console.log("STATION:", station);
    //
    //     // this.mqttClient.client.publish(
    //     //     "station/wodData",
    //     //     JSON.stringify({ topic: topic, data: station }),
    //     //     { qos: 1 }
    //     // );
    //
    //     this.mqttClient.client.publish(topic, JSON.stringify(station), {
    //         qos: 0,
    //     });
    // }
    //
    // extractRelativesInfo(json) {
    //     let myStation;
    //     let myWorkout;
    //     for (const station of json.stations) {
    //         if (station.configs?.station_ip === this.ip) {
    //             myStation = station;
    //             // myStation.state = json.globals.state;
    //         }
    //     }
    //
    //     json.stations = myStation;
    //
    //     if (myStation) {
    //         for (const workout of json.workouts) {
    //             if (workout.categories.includes(myStation.category)) {
    //                 myWorkout = workout;
    //             }
    //         }
    //     }
    //     json.workouts = myWorkout;
    //
    //     return json;
    // }
    //
    //
    // publishData(buttonValue) {
    //     if (this.db.getData("/stations/dynamics/state") === 2) {
    //         setTimeout(() => {
    //             const station = this.db.getData("/stations/");
    //             this.wodInterpreter.pressCounter(
    //                 Date.now(),
    //                 Date.parse(this.db.getData("/globals/startTime")),
    //                 station.dynamics.measurements,
    //                 station.dynamics.currentWodPosition,
    //                 parseInt(buttonValue)
    //             );
    //
    //             // save db
    //             this.db.save();
    //
    //             //Publish to server
    //             this.sendToServer("station/generic");
    //
    //         }, 50);
    //     }
    // }
}

export default Station;
