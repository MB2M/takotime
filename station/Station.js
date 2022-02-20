// import mqttClient from "./mqttClient.js";
import network from "network";
// import noble from "@abandonware/noble";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import MqttClient from "./utils/MqttClient.js";
// import BLEPeripheral from "./BLEPeripheral.js";
import BLEServices from "./utils/BTServices.js";

class Station {
    constructor(ip) {
        this.ip = ip;
        this.bleServices = new BLEServices();
        this.counter = {};
        this.board = {};
        this.db = new JsonDB(new Config("./livestation", true, true, "/"));
        this.db.push("/", {});
    }

    async getMqttClient(MQTT_URL, options) {
        this.mqttClient = new MqttClient(MQTT_URL, options, [
            "server/wodConfig",
            "server/wodConfigUpdate",
            "server/wodGlobals",
        ]);
        return this;
    }

    initMqtt() {
        this.mqttClient.client.on("message", async (topic, message) => {
            //Only when the station connect for the first time
            if (topic === "server/wodConfig") {
                const json = JSON.parse(message.toString());
                const data = this.updateDB(json);

                this.bleServices.scan({
                    counter: {
                        id: data.stations.configs.counter.mac,
                        cb: (value) => {
                            this.publishData(value);
                        },
                    },
                    board: { id: data.stations.configs.board.mac },
                });
            }

            if (topic === "server/wodConfigUpdate") {
                const oldStations = this.db.getData("/stations");

                const json = JSON.parse(message.toString());
                const data = this.updateDB(json);

                let changed = false;

                if (
                    oldStations.configs.counter.mac !==
                    data.stations.configs.counter.mac
                ) {
                    this.bleServices.disconnect("counter");
                    changed = true;
                }

                if (
                    oldStations.configs.board.mac !==
                    data.stations.configs.board.mac
                ) {
                    this.bleServices.disconnect("board");
                    changed = true;
                }

                if (changed) {
                    this.bleServices.scan({
                        counter: {
                            id: data.stations.configs.counter.mac,
                            cb: (value) => {
                                this.publishData(value);
                            },
                        },
                        board: { id: data.stations.configs.board.mac },
                    });
                }
            }

            if (topic === "server/wodGlobals") {
                this.db.push("/globals", JSON.parse(message));
            }
        });
    }


    updateDB(json) {
        let myStation;
        for (const station of json.stations) {
            if (station.configs.station_ip === this.ip) {
                myStation = station;
            }
        }
        json.stations = myStation;
        if (myStation) this.db.push("/", json);
        return json;
    }

    publishData(buttonValue) {
        if (this.db.getData("/globals/state") === 2) {
            const station = this.db.getData("/stations");
            const newreps = station.reps + parseInt(buttonValue);

            let data = {
                lane_number: station.lane_number,
                finish: station.finish,
                reps: newreps,
                time: "",
            };

            //Publish to server
            this.db.push("/stations/reps", newreps);
            this.mqttClient.client.publish(
                "station/wodData",
                JSON.stringify(data),
                {
                    qos: 1,
                }
            );

            //publish to screen
            this.bleServices.board.charac &&
                this.bleServices.board.charac.write(
                    Buffer.from(
                        JSON.stringify({
                            ...data,
                            name: station.athlete,
                            result: station.time,
                        })
                    ),
                    true
                );
        }
    }
}

export default Station;
