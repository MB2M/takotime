import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import MqttClient from "./utils/MqttClient.js";
import BLEServices from "./utils/BLEServices.js";
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
        this.bleServices = new BLEServices();
        this.wodInterpreter = new WodInterpreter();
        this.timer = new WodTimer();
        this.buzzer = new onoff.Gpio(18, "in", "falling", {
            debounceTimeout: 10,
        });
        this.lastPush = 0;
    }

    async initProcess() {
        this.initWodInterpreterEventLister();
        this.initBLEEventListener();
        this.initTimerEventListener();
        this.initButtons();
        this.initMqttEventListener();
    }

    initWodInterpreterEventLister() {
        this.wodInterpreter.on(
            "checkpoint",
            (measurement, isFinal, shortcut) => {
                this.db.push(
                    "/stations/measurements",
                    {
                        [measurement.measurementId]: {
                            value: measurement.value,
                            type: measurement.type,
                            shortcut,
                        },
                    },
                    false
                );

                if (isFinal) {
                    this.wodFinish();
                    this.timer.stopTimer();
                } else {
                    const currentWodPosition = this.db.getData(
                        "/stations/currentWodPosition"
                    );

                    console.log(this.wodInterpreter.measurements);
                    console.log(measurement.measurementId);

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

                    this.db.save();

                    this.updateBoard();
                }

                // TODO: SI TYPE EST CHECKPOINT
            }
        );
    }

    initMqttEventListener() {
        this.mqttClient.client.on("message", async (topic, message) => {
            console.log("Topic Received:", topic);

            if (
                topic === "server/wodConfig" ||
                topic === "server/wodConfigUpdate"
            ) {
                const json = JSON.parse(message.toString());
                const data = this.extractRelativesInfo(json);
                if (data.stations) {
                    data.stations.appVersion =
                        loadJsonFileSync("package.json").version;

                    // first time init
                    if (!data.stations.currentWodPosition) {
                        data.stations.currentWodPosition = {
                            block: 0,
                            round: 0,
                            movement: 0,
                            reps: 0,
                            repsPerBlock: [],
                        };
                    }
                    if (!data.stations.measurements) {
                        data.stations.measurements = {};
                    }
                }
                this.updateDB(data);

                const devices = this.getRequiredDevices();
                console.log(devices);
                this.bleServices.connectTo(devices);

                try {
                    this.wodInterpreter.load(this.db.getData("/workouts"));
                    if (data.stations.state < 2) {
                        this.wodInterpreter.getRepsInfo(
                            data.stations.currentWodPosition
                        );
                        // save db
                        this.db.save();
                    }
                } catch (err) {
                    console.log("No workout to load");
                }

                if (data.globals.duration !== 0) {
                    this.initTimer(json.globals);
                } else {
                    this.timer && this.timer.stopTimer();
                    this.updateBoard();
                }
            }

            if (topic === "server/wodGlobals") {
                const json = JSON.parse(message);
                if (this.isNewGlobals(json)) this.initTimer(json);
                this.db.push("/globals", json);
            }

            if (topic === "server/scriptReset") {
                if (this.ip === message.toString()) {
                    exec("sudo systemctl restart station", function (msg) {
                        console.log(msg);
                    });
                }
            }

            if (topic === "server/restartUpdate") {
                if (this.ip === message.toString()) {
                    exec(
                        "git pull origin main && sudo systemctl restart station",
                        function (msg) {
                            console.log(msg);
                        }
                    );
                }
            }
        });
    }

    initBLEEventListener() {
        this.bleServices.on("stateChange", (device) => {
            const state = device.peripheral.state;
            try {
                const index = this.db.getIndex(
                    "/stations/configs/devices",
                    device.role,
                    "role"
                );
                // update DB
                this.db.push(
                    `/stations/configs/devices[${index}]/state`,
                    state
                );
                // send to server
                this.sendToServer("blePeripheral");
            } catch {
                console.error("can't update BLE status");
            }

            this.updateBoard();
        });
    }

    initTimerEventListener() {
        this.timer.on("countdown", (value) => {
            console.log("WOD COUNTDOWN TIMER");
            try {
                const station = this.db.getData("/stations");
                if (station.state !== 1) this.changeState(1);
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
                this.db.getData("/stations/measurements"),
                this.db.getData("/globals/startTime"),
                checkpoint,
                this.db.getData("/stations/currentWodPosition")
            );
        });
    }

    isNewGlobals(globals) {
        try {
            const actual = this.db.getData("/globals/startTime");
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

    initButtons() {
        console.log("INIT BUZZER");

        this.buzzer.watch((err, value) => {
            if (err) {
                throw err;
            }

            if (this.db.getData("/stations/state") === 2) {
                const now = Date.now();

                if (now < this.lastPush + 20000) return;

                this.lastPush = now;

                this.wodInterpreter.pressBuzzer(
                    now,
                    Date.parse(this.db.getData("/globals/startTime")),
                    this.db.getData("/stations/measurements"),
                    this.db.getData("/stations/currentWodPosition")
                );
            }
        });

        process.on("SIGINT", (_) => {
            this.buzzer.unexport();
            this.resetScanBLE.unexport();
        });
        console.log("BUZZER LOADED");
    }

    changeState(state) {
        if (this.timer && state === 3) this.timer.stopTimer();

        this.db.push("/stations/state", state);

        //TODO: appeller un preparateur de message pour le serveur basé sur le state
        // Pour l'instant  le message est de type reps

        //Publish to server
        this.sendToServer("reps");

        //publish to screen
        this.updateBoard();

        // this.emit("newState", state);
    }

    wodFinish() {
        const result = this.wodInterpreter.getFinalScore(
            // this.db.getData("/stations/currentWodPosition"),
            this.db.getData("/stations/measurements")
        );

        this.db.push("/stations/result", result);
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

    updateBoard(value) {
        const board = this.bleServices.connectedDevices.find(
            (d) => d.role === "board"
        );

        if (board && board.charac) {
            console.log(value)
            board.charac.write(displayBuffer(this.db, { value: value }), true);
        }
    }

    initTimer(json) {
        const checkPointTime = this.wodInterpreter.getCheckpointTime();
        this.timer.stopTimer();
        this.timer.launchTimer(json.startTime, json.duration, checkPointTime);
    }

    sendToServer(topic) {
        const station = this.db.getData("/stations");
        console.log("STATION:", station);

        this.mqttClient.client.publish(
            "station/wodData",
            JSON.stringify({ topic: topic, data: station }),
            { qos: 1 }
        );
    }

    extractRelativesInfo(json) {
        let myStation;
        let myWorkout;
        for (const station of json.stations) {
            if (station.configs && station.configs.station_ip === this.ip) {
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
        if (this.db.getData("/stations/state") === 2) {
            const station = this.db.getData("/stations/");
            this.wodInterpreter.pressCounter(
                Date.now(),
                Date.parse(this.db.getData("/globals/startTime")),
                station.measurements,
                station.currentWodPosition,
                parseInt(buttonValue)
            );

            // save db
            this.db.save();

            //Publish to server
            this.sendToServer("reps");

            //publish to screen
            this.updateBoard();
        }
    }
}

export default Station;
