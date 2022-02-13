import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

const options = {
    username: "takotime",
    password: "massilia",
    clean: false,
    // clientId: "mqttjs_" + 42,
};

// const client = mqtt.connect("mqtt://localhost:8080", {
//     ...options,
//     clientId: "mqttjs_" + 1,
// }); // create a client
// const client2 = mqtt.connect("mqtt://localhost:8080", {
//     ...options,
//     clientId: "mqttjs_" + 2,
// }); // create a client
// const client3 = mqtt.connect("mqtt://localhost:8080", {
//     ...options,
//     clientId: "mqttjs_" + 3,
// }); // create a client

const initClient = (client: mqtt.Client, lane: number) => {
    client.on("connect", function () {
        console.log("connected");
        client.subscribe("server/wodConfig", { qos: 1 }, function (err) {
            console.log("subscribed");
            if (!err) {
                let counter = 0;
                let start = Date.now();
                const interval = setInterval(() => {
                    let data = {
                        lane_number: lane,
                        finish: false,
                        reps: counter,
                        time: 0,
                    };
                    if (counter > 50) {
                        data.finish = true;
                        data.time = Date.now() - start;
                        client.publish(
                            "station/wodData",
                            JSON.stringify(data),
                            {
                                qos: 1,
                            }
                        );
                        clearInterval(interval);
                    }
                    client.publish("station/wodData", JSON.stringify(data), {
                        qos: 1,
                    });
                    console.log(`data sent: ${JSON.stringify(data)}`);
                    counter = counter + Math.floor(Math.random() * 3);
                }, 1000);
                client.on("close", () => {
                    clearInterval(interval);
                });
            }
        });
    });
};

// client.on("message", function (topic, message) {
//     if (topic === "server/wodConfig") {
//         console.log(JSON.parse(message.toString()));
//         client.unsubscribe("server/wodConfig");
//     }
// });

for (let i = 1; i < 10; i++) {
    sleep(1000 * Math.floor(Math.random() * 3)).then(() => {
        initClient(
            mqtt.connect("mqtt://localhost:8081", {
                ...options,
                clientId: "mqttjs_" + i,
            }),
            i
        );
    });
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
