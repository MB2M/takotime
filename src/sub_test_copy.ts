import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

const options = {
    username: "takotime",
    password: "massilia",
    clean: false,
    clientId: "mqttjs_" + 44,
};
const client = mqtt.connect("mqtt://localhost:8081", options); // create a client

client.on("connect", function () {
    console.log("connected");
    client.subscribe("server/wodConfigUpdate")
    client.subscribe("server/wodConfig", { qos: 1 }, function (err) {
        client.on("message", function (topic, message) {
            if (topic === "server/wodConfig") {
                console.log(JSON.parse(message.toString()));
                // client.unsubscribe("server/wodConfig");
            }
        });
    });
});

client.on("message", function (topic, message) {
    // message is Buffer
    if (topic === "server/wodConfigUpdate") {

        console.log("UPDATE: ", message.toString());
    }
});
