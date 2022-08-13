import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import MqttClient from "./utils/MqttClient.js";
// import BLEServices from "./utils/BLEServices.js";
import WodInterpreter from "./utils/workouts/WodInterpreter.js";
import WodTimer from "./utils/WodTimer.js";
import displayBuffer from "./utils/displayHelper.js";
import onoff from "onoff";
import { exec } from "child_process";
import { loadJsonFileSync } from "load-json-file";

class Station {
    constructor(ip, mqttUrl, mqttOptions, mqttTopics) {
        this.ip = ip;
        this.db = new JsonDB(new Config("./livestation", true, false, "/"));
        this.db.push("/", {});
        this.mqttClient = new MqttClient(
            mqttUrl,
            {
                ...mqttOptions,
                clientId: ip,
            },
            mqttTopics
        );
        // this.bleServices = new BLEServices();
        this.wodInterpreter = new WodInterpreter();
        this.timer = new WodTimer();
        this.buzzer = new onoff.Gpio(18, "in", "falling", {
            debounceTimeout: 10,
        });
        this.lastPush = 0;
        this.stationNumberSubscribe = 0;
        this.devicesSubscribe = [0, 0];
    }

    async initProcess() {
        this.initWodInterpreterEventLister();
        // this.initBLEEventListener();
        this.initTimerEventListener();
        this.initButtons();
        this.initMqttEventListener();
    }

    initWodInterpreterEventLister() {
        this.wodInterpreter.on("tieBreak", (tieBreak) => {
            const payload = {
                id: tieBreak.measurementId,
                tieBreak: {
                    value: tieBreak.value,
                    method: tieBreak.method,
                },
            };

            this.db.push("/stations/dynamics/measurements[]", payload);

            //Publish to server
            this.sendToServer("station/generic");

            //publish to screen
            this.updateBoard();
        });

        this.wodInterpreter.on(
            "checkpoint",
            (measurement, isFinal, shortcut) => {
                console.log("CHECKPOINT!!!!");
                let lastMeasurement = {};
                if (
                    this.db.getData("/stations/dynamics/measurements").length >
                    0
                ) {
                    lastMeasurement = this.db.getData(
                        "/stations/dynamics/measurements[-1]"
                    );
                }

                const payload = {
                    id: measurement.measurementId,
                    value: measurement.value,
                    method: measurement.method,
                    shortcut,
                };

                if (lastMeasurement.id === measurement.measurementId) {
                    this.db.push(
                        "/stations/dynamics/measurements[-1]",
                        payload,
                        false
                    );
                } else {
                    this.db.push("/stations/dynamics/measurements[]", payload);
                }

                if (isFinal) {
                    this.wodFinish();
                    this.timer.stopTimer();
                } else {
                    const currentWodPosition = this.db.getData(
                        "/stations/dynamics/currentWodPosition"
                    );

                    const nextBlock =
                        this.wodInterpreter.measurements[
                            measurement.measurementId
                        ].blocksId.at(-1) + 1;

                    currentWodPosition.block = nextBlock;
                    currentWodPosition.round = 0;
                    currentWodPosition.movement = 0;
                    currentWodPosition.reps = 0;

                    this.wodInterpreter.pressCounter(
                        Date.now(),
                        Date.parse(this.db.getData("/globals/startTime")),
                        measurement,
                        currentWodPosition,
                        0
                    );

                    setTimeout(() => {
                        this.db.save();

                        //Publish to server
                        this.sendToServer("station/generic");

                        this.updateBoard();
                    }, 50);
                }

                // TODO: SI TYPE EST CHECKPOINT
            }
        );
    }

    initMqttEventListener() {
        this.mqttClient.client.on("message", async (topic, message) => {
            console.log("Topic Received:", topic);
            if (topic === `server/wodConfig/${this.ip}`) {
                const json = JSON.parse(message.toString());

                let myWorkout;
                for (const workout of json.workouts) {
                    if (workout.categories.includes(json.stations.category)) {
                        myWorkout = workout;
                    }
                }
                json.workouts = myWorkout;

                this.setStationWodConfig(json);
            }

            if (
                topic === "server/wodConfig" ||
                topic === "server/wodConfigUpdate"
            ) {
                const json = JSON.parse(message.toString());
                const data = this.extractRelativesInfo(json);
                this.setStationWodConfig(data);
                // if (data.stations?.dynamics) {
                //     data.stations.dynamics.appVersion =
                //         loadJsonFileSync("package.json").version;

                //     // first time init
                //     if (!data.stations.dynamics.currentWodPosition) {
                //         data.stations.dynamics.currentWodPosition = {
                //             block: 0,
                //             round: 0,
                //             movement: 0,
                //             reps: 0,
                //             repsPerBlock: [],
                //         };
                //     }
                //     if (!data.stations.dynamics.measurements) {
                //         data.stations.dynamics.measurements = [];
                //     }
                // }
                // this.updateDB(data);

                // const devices = this.getRequiredDevices();
                // this.bleServices.connectTo(devices);

                // try {
                //     this.wodInterpreter.load(this.db.getData("/workouts"));
                //     if (data.stations.dynamics.state < 2) {
                //         this.wodInterpreter.getRepsInfo(
                //             data.stations.dynamics.currentWodPosition
                //         );
                //         // save db
                //         this.db.save();
                //     }
                //     if (
                //         data.globals.duration !== 0
                //         // && data.stations.dynamics.result === ""
                //     ) {
                //         this.initTimer(json.globals);
                //     } else {
                //         this.timer && this.timer.stopTimer();
                //         this.updateBoard();
                //     }
                // } catch (err) {
                //     console.log("No workout to load");
                // }
            }

            if (topic === "server/wodGlobals") {
                const json = JSON.parse(message);
                if (this.isNewGlobals(json)) this.initTimer(json);
                this.db.push("/globals", json);
            }

            if (topic === "server/scriptReset") {
                if (this.ip === message.toString()) {
                    this.mqttClient.client.end();
                    exec("pm2 restart 0", function (msg) {
                        console.log(msg);
                    });
                }
            }

            if (topic === "server/restartUpdate") {
                if (this.ip === message.toString()) {
                    exec(
                        "cd && cd takotime && sudo git pull origin && pm2 restart all",
                        function (msg) {
                            console.log(msg);
                        }
                    );
                }
            }

            if (topic === `counter/${this.devicesSubscribe[0]}`) {
                this.publishData(message);
            }

            if (topic === `board/${this.devicesSubscribe[1]}/connect`) {
                this.updateBoard();
            }
        });
    }

    // initBLEEventListener() {
    //     this.bleServices.on("stateChange", (device) => {
    //         const state = device.peripheral.state;
    //         try {
    //             const index = this.db.getIndex(
    //                 "/stations/configs/devices",
    //                 device.role,
    //                 "role"
    //             );
    //             // update DB
    //             this.db.push(
    //                 `/stations/configs/devices[${index}]/state`,
    //                 state
    //             );
    //             // send to server
    //             this.sendToServer("station/blePeripheral");
    //         } catch {
    //             console.error("can't update BLE status");
    //         }

    //         this.updateBoard();
    //     });
    // }

    initTimerEventListener() {
        this.timer.on("countdown", (value) => {
            console.log("WOD COUNTDOWN TIMER");
            try {
                const station = this.db.getData("/stations");
                if (station.dynamics.state !== 1) this.changeState(1);
            } finally {
                this.updateBoard(value);
            }
        });

        this.timer.on("wodStarted", () => {
            console.log("WOD STARTED TIMER");
            this.changeState(2);
        });

        this.timer.on("wodEnded", () => {
            console.log("WOD ENDED TIMER");
            this.changeState(3);
        });

        this.timer.on("timeCheckpoint", (checkpoint) => {
            console.log("NEW CHECKPOINT: ", checkpoint);
            this.wodInterpreter.checkpoint(
                "timer",
                this.db.getData("/stations/dynamics/measurements"),
                this.db.getData("/globals/startTime"),
                checkpoint,
                this.db.getData("/stations/dynamics/currentWodPosition")
            );
        });
    }

    isNewGlobals(globals) {
        try {
            const actual = this.db.getData("/globals");
            const actualStartTime = actual.startTime;
            const actualDuration = actual.duration;

            return (
                actualStartTime !== globals.startTime ||
                actualDuration !== globals.duration
            );
        } catch (err) {
            return globals ? true : false;
        }
    }

    setStationWodConfig(data) {
        console.log(data);
        if (data.stations?.dynamics) {
            data.stations.dynamics.appVersion =
                loadJsonFileSync("package.json").version;

            // first time init
            if (!data.stations.dynamics.currentWodPosition) {
                data.stations.dynamics.currentWodPosition = {
                    block: 0,
                    round: 0,
                    movement: 0,
                    reps: 0,
                    repsPerBlock: [],
                };
            }
            if (!data.stations.dynamics.measurements) {
                data.stations.dynamics.measurements = [];
            }
        }
        this.updateDB(data);

        const newCounterMac = data.stations.configs?.devices?.find(
            (device) => device.role === "counter"
        )?.mac;
        const newBoardMac = data.stations.configs?.devices?.find(
            (device) => device.role === "board"
        )?.mac;

        if (newCounterMac !== this.devicesSubscribe[0]) {
            this.mqttClient.client.unsubscribe(
                `counter/${this.devicesSubscribe[0]}`
            );
            this.mqttClient.client.subscribe(`counter/${newCounterMac}`);
            this.devicesSubscribe[0] = newCounterMac;
        }

        if (newBoardMac !== this.devicesSubscribe[1]) {
            this.mqttClient.client.unsubscribe(
                `board/${this.devicesSubscribe[1]}/connect`
            );
            this.mqttClient.client.subscribe(`board/${newBoardMac}/connect`);
            this.devicesSubscribe[1] = newBoardMac;
        }

        // const devices = this.getRequiredDevices();
        // this.bleServices.connectTo(devices);

        try {
            this.wodInterpreter.load(this.db.getData("/workouts"));
            if (data.stations.dynamics.state < 2) {
                this.wodInterpreter.getRepsInfo(
                    data.stations.dynamics.currentWodPosition
                );
                // save db
                this.db.save();
            }
            if (
                data.globals.duration !== 0
                // && data.stations.dynamics.result === ""
            ) {
                this.initTimer(json.globals);
            } else {
                this.timer && this.timer.stopTimer();
                this.updateBoard();
            }
        } catch (err) {
            console.log("No workout to load");
        }
    }

    initButtons() {
        this.buzzer.watch((err, value) => {
            if (err) {
                throw err;
            }

            if (this.db.getData("/stations/dynamics/state") === 2) {
                const now = Date.now();

                if (now < this.lastPush + 20000) return;

                this.lastPush = now;

                this.wodInterpreter.pressBuzzer(
                    now,
                    Date.parse(this.db.getData("/globals/startTime")),
                    this.db.getData("/stations/dynamics/measurements"),
                    this.db.getData("/stations/dynamics/currentWodPosition")
                );
            }
        });

        process.on("SIGINT", (_) => {
            this.buzzer.unexport();
            // this.resetScanBLE.unexport();
        });
        console.log("BUZZER LOADED");
    }

    changeState(state) {
        if (this.timer && state === 3) this.timer.stopTimer();

        this.db.push("/stations/dynamics/state", state);

        //TODO: appeller un preparateur de message pour le serveur basé sur le state
        // Pour l'instant  le message est de type reps

        //Publish to server
        this.sendToServer("station/generic");

        //publish to screen
        this.updateBoard();

        // this.emit("newState", state);
    }

    wodFinish() {
        const result = this.wodInterpreter.getFinalScore(
            // this.db.getData("/stations/dynamics/currentWodPosition"),
            this.db.getData("/stations/dynamics/measurements")
        );

        this.db.push("/stations/dynamics/result", result);
        this.changeState(3);
    }

    getRequiredDevices() {
        try {
            const requiredDevices = this.db.getData(
                "/stations/configs/devices"
            );
            return requiredDevices.map((d) => {
                let callback = {};
                if (d.role === "counter") {
                    callback = {
                        cb: (value) => {
                            this.publishData(value);
                        },
                    };
                }
                return { role: d.role, id: d.mac, ...callback };
            });
        } catch {
            return [];
        }
    }

    async updateBoard(value) {
        // const board = this.bleServices.connectedDevices.find(
        //     (d) => d.role === "board"
        // );

        // if (board && board.charac) {
        //     board.charac.write(displayBuffer(this.db, { value: value }), true);
        // }

        this.mqttClient.client.publish(
            `board/${this.stationNumberSubscribe}`,
            displayBuffer(this.db, { value: value }),
            {
                qos: 0,
            }
        );
    }

    initTimer(json) {
        const checkPointTime = this.wodInterpreter.getCheckpointTime();
        this.timer.stopTimer();
        this.timer.launchTimer(json.startTime, json.duration, checkPointTime);
    }

    sendToServer(topic) {
        const station = this.db.getData("/stations");
        // console.log("STATION:", station);

        // this.mqttClient.client.publish(
        //     "station/wodData",
        //     JSON.stringify({ topic: topic, data: station }),
        //     { qos: 1 }
        // );

        this.mqttClient.client.publish(topic, JSON.stringify(station), {
            qos: 0,
        });
    }

    extractRelativesInfo(json) {
        let myStation;
        let myWorkout;
        for (const station of json.stations) {
            if (station.configs?.station_ip === this.ip) {
                myStation = station;
                // myStation.state = json.globals.state;
            }
        }

        json.stations = myStation;

        if (myStation) {
            for (const workout of json.workouts) {
                if (workout.categories.includes(myStation.category)) {
                    myWorkout = workout;
                }
            }
        }
        json.workouts = myWorkout;

        return json;
    }

    updateDB(json) {
        this.db.push("/", json);
    }

    publishData(buttonValue) {
        if (this.db.getData("/stations/dynamics/state") === 2) {
            setTimeout(() => {
                const station = this.db.getData("/stations/");
                this.wodInterpreter.pressCounter(
                    Date.now(),
                    Date.parse(this.db.getData("/globals/startTime")),
                    station.dynamics.measurements,
                    station.dynamics.currentWodPosition,
                    parseInt(buttonValue)
                );

                // save db
                this.db.save();

                //Publish to server
                this.sendToServer("station/generic");

                //publish to screen
                this.updateBoard();
            }, 50);
        }
    }
}

export default Station;
