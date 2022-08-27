import { Aedes } from "aedes";
import * as mqtt from "mqtt";
import config from "../../config";

class MqttServices {
    options = {
        username: config.brokerUsername,
        password: config.brokerPassword,
        clean: true,
        clientId: `TAKOTIME_SERVER_${Math.floor(Math.random() * 100)}`,
    };

    client: mqtt.MqttClient;
    // brokerSocket: AedesWithClients<Aedes>;

    // constructor(brokerSocket: AedesWithClients<Aedes>) {
    constructor() {
        this.client = mqtt.connect(`${config.mqttUrl}`, this.options);
        // this.brokerSocket = brokerSocket;
    }

    subscribe(topics: string[]) {
        this.client.subscribe(topics, { qos: 1 });
    }

    registerListener(
        aimedTopic: string,
        listener: (topic: string, message: any) => void
    ) {
        this.client.on("message", async (topic, message) => {
            if (topic.includes(aimedTopic))
                listener(topic, JSON.parse(message.toString()));
        });
    }

    send(topic: string, message: string) {
        try {
            this.client.publish(topic, message, {
                qos: 1,
            });
            console.log("MQTT/Send:", topic);
        } catch (err) {
            console.error(err);
        }
    }

    // getAllBrokerClients() {
    //     let clients = {};
    //     Object.entries(this.brokerSocket.clients).forEach(([k, v]) => {
    //         clients = { ...clients, [k]: v.connected };
    //     });
    //     return clients;
    // }
}

export default MqttServices;
