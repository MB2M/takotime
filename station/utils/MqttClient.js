import mqtt from "mqtt";

class MqttClient {
    constructor(mqttUrl, options, topics) {
        this.mqttUrl = mqttUrl;
        this.options = options;
        this.topics = topics;

        this.connect();
        setInterval(() => {
            console.log(this.client?.connected);
            if (!this.client?.connected) this.connect();
        }, 5000);
        // this.client = mqtt.connect(mqttUrl, options);
        // if (topics) {
        //     this.client.on("connect", () => {
        //         console.log("connected to MQTT broker");
        //         this.subscribe(topics);
        //         this.client.publish(
        //             `connected/station/${options.clientId}`,
        //             "1",
        //             { retain: true }
        //         );
        //         this.client.publish(
        //             "station/connection",
        //             JSON.stringify({
        //                 ip: options.clientId,
        //                 responseTopic: `server/wodConfig/${options.clientId}`,
        //             })
        //         );
        //     });
        // }
    }

    subscribe(topics) {
        this.client.subscribe(topics, { qos: 1 }, function (err) {
            if (err) console.log(err);
        });
    }

    connect() {
        this.client = mqtt.connect(this.mqttUrl, this.options);
        if (this.topics) {
            this.client.on("connect", () => {
                console.log("connected to MQTT broker");
                this.subscribe(this.topics);
                this.client.publish(
                    `connected/station/${this.options.clientId}`,
                    "1",
                    { retain: true }
                );
                this.client.publish(
                    "station/connection",
                    JSON.stringify({
                        ip: this.options.clientId,
                        responseTopic: `server/wodConfig/${this.options.clientId}`,
                    })
                );
            });
        }
    }
}

export default MqttClient;
