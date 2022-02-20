import mqtt from "mqtt";

class MqttClient {
    constructor(mqttUrl, options, topics) {
        this.client = mqtt.connect(mqttUrl, options);
        if (topics) {
            this.client.on("connect", () => {
                console.log("connected");
                this.subscribe(topics);
            });
        }
    }

    subscribe(topics) {
        this.client.subscribe(topics, { qos: 1 }, function (err) {
            if (err) console.log(err);
        });
    }
}

export default MqttClient;
