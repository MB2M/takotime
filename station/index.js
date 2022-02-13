import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import mqtt from "mqtt";
import * as dotenv from "dotenv";
dotenv.config();
import noble from "@abandonware/noble";

const MY_IP = "192.168.3.101";

const MQTT_URL = "mqtt://192.168.3.3:8081";

const options = {
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    clientId: "mqttjs_101",
};

const clientMqtt = mqtt.connect(MQTT_URL, options);

const db = new JsonDB(new Config("./livestation", true, true, "/"));

clientMqtt.on("connect", () => {
    console.log("connected");
    clientMqtt.subscribe("server/wodConfig", { qos: 1 }, function (err) {
        if (err) console.log(err);
    });
    clientMqtt.subscribe("server/wodConfigUpdate", { qos: 1 }, function (err) {
        if (err) console.log(err);
    });
    clientMqtt.subscribe("server/wodGlobals", { qos: 1 }, function (err) {
        if (err) console.log(err);
    });
});

clientMqtt.on("message", (topic, message) => {
    if (topic === "server/wodConfig") {
        db.push("/", JSON.parse(message));
    }
    if (topic === "server/wodConfigUpdate") {
        const json = JSON.parse(message);
        let myStation;
        for (const station of json.stations) {
            if (station.stuff.station_ip === MY_IP) {
                myStation = station;
            }
        }
        json.stations = myStation;
        console.log(myStation);
        if (myStation) db.push("/", json);
    }
    if (topic === "server/wodGlobals") {
        db.push("/globals", JSON.parse(message));
    }
});

noble.on("stateChange", async (state) => {
    if (state === "poweredOn") {
        const scan = await noble.startScanningAsync([]);
        console.log(scan);
    }
});

noble.on("discover", async (peripheral) => {
    if (peripheral.id === "083af2abac22") {
        console.log(peripheral.uuid);
        await noble.stopScanningAsync();
        await peripheral.connectAsync();
        const service = (
            await peripheral.discoverServicesAsync([
                "364dff7c036546888146b1c0234e7ebb",
            ])
        )[0];
        const charac = (await service.discoverCharacteristicsAsync())[0];
        console.log("init subscribe");
        charac.subscribe((error) => {
            charac.on("data", (data) => {
                console.log(data.toString());
                publichData(data.toString());
            });
        });
        peripheral.on("disconnect", async () => {
            console.log("disconnected");
            await noble.startScanningAsync();
        });
    }
});

const publichData = (buttonValue) => {
    const station = db.getData("/stations");
    const newreps = station.reps + parseInt(buttonValue);

    let data = {
        lane_number: station.lane_number,
        finish: station.finish,
        reps: newreps,
        time: 0,
    };
    db.push("/stations/reps", newreps);
    clientMqtt.publish("station/wodData", JSON.stringify(data), {
        qos: 1,
    });
}