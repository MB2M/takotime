import { Aedes } from "aedes";
import * as mqtt from "mqtt";
import config from "../../config";

class MqttServices {
    options = {
        username: config.brokerUsername,
        password: config.brokerPassword,
        clean: false,
        clientId: "TAKOTIME_SERVER",
    };

    client: mqtt.MqttClient;
    brokerSocket: AedesWithClients<Aedes>;

    constructor(brokerSocket: AedesWithClients<Aedes>) {
        this.client = mqtt.connect(
            `${config.brokerUri}:${config.brokerPort}`,
            this.options
        );
        this.brokerSocket = brokerSocket;
    }

    subscribe(topics: string[]) {
        this.client.subscribe(topics);
    }

    registerListener(aimedTopic: string, listener: (arg0: any) => void) {
        this.client.on("message", async (topic, message) => {
            if (topic === aimedTopic) listener(JSON.parse(message.toString()));
        });
    }

    send(topic: string, message: string) {
        try {
            this.client.publish(topic, message, {
                qos: 2,
            });
            console.log("MQTT/Send:", topic);
        } catch (err) {
            console.error(err);
        }
    }

    getAllBrokerClients() {
        let clients = {};
        Object.entries(this.brokerSocket.clients).forEach(([k, v]) => {
            clients = { ...clients, [k]: v.connected };
        });
        return clients;
    }
}

export default MqttServices;
