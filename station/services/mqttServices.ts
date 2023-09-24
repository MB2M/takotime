import type { MqttClient } from "mqtt";

class MqttServices {
    client: MqttClient;
    listeners: { [topic: string]: ((message: any) => void)[] } = {};
    connnectListeners: (() => void)[] = [];

    constructor(mqttClient: MqttClient, initialTopics: string[] = []) {
        this.client = mqttClient;
        this.client.on("message", (topic, message) => {
            const messageString = message.toString();

            `Received message on topic ${topic}: ${messageString}`;
            let formattedMessage: string | object;
            try {
                formattedMessage = JSON.parse(messageString);
            } catch (e) {
                formattedMessage = messageString;
            }
            const listeners = this.listeners[topic] || [];
            listeners.forEach((listener) => listener(formattedMessage));
        });
        this.client.on("connect", () => {
            this.connnectListeners.forEach((listener) => listener());
        });
        this.subscribe(initialTopics);
    }

    connected() {
        return this.client.connected;
    }

    subscribe(topics: string[]) {
        this.client.subscribe(topics, { qos: 1 });
    }

    registerListener(topic: string, listener: (message: any) => void) {
        this.listeners[topic] ??= [];
        this.listeners[topic].push(listener);
    }

    registerConnectListener(
        listener: () => void,
        callImmediately: boolean = false
    ) {
        this.connnectListeners.push(listener);
        if (callImmediately && this.connected()) {
            listener();
        }
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
}

export default MqttServices;
