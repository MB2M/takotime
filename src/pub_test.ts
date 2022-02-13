import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

const options = {
    username: "takotime",
    password: "massilia",
    clean: false,
    clientId: "mqttjs_" + 43,
};

let client = mqtt.connect("mqtt://localhost:8080", options); // create a client

client.on("connect", function () {
    console.log("connected");
    client.subscribe("presence", function (err) {
        if (!err) {
            let counter = 0;
            const interval = setInterval(() => {
                client.publish("presence", `Hello count ${counter}`, {
                    qos: 1,
                });
                counter++;
            }, 5000);
            client.on("close", () => {
                clearInterval(interval);
            });
        }
    });
});

client.on("message", function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});
