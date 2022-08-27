import mqtt from "mqtt";

class MqttClient {
    constructor(mqttUrl, options, topics) {
        this.client = mqtt.connect(mqttUrl, options);
        if (topics) {
            this.client.on("connect", () => {
                console.log("connected to MQTT broker");
                this.subscribe(topics);
                this.client.publish(
                    `connected/station/${options.clientId}`,
                    "1"
                );
                this.client.publish(
                    "station/connection",
                    JSON.stringify({
                        ip: options.clientId,
                        responseTopic: `server/wodConfig/${options.clientId}`,
                    })
                );
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
