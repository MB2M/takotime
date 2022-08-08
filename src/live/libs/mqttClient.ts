import * as mqtt from "mqtt";

//MQTT Client
const options = {
    username: process.env.BROKER_USERNAME as string,
    password: process.env.BROKER_PASSWORD as string,
    clean: false,
    clientId: "TAKOTIME_SERVER",
};

const loadSubscriptions = (client: mqtt.Client) => {
    client.on("connect", function () {
        console.log("mqtt client connected");
    });

    client.on("close", () => {
        console.log("mqtt client end");
    });

    client.on("reconnect", () => {
        console.log("mqtt client reconnect");
    });

    client.on("offline", () => {
        console.log("mqtt client offline");
    });
};

const client = mqtt.connect(
    // `${process.env.BROKER_URI}:${process.env.BROKER_PORT}`,
    `${process.env.MQTT_URL}`,
    options
);

loadSubscriptions(client);

export default client;
