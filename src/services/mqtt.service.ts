import type { MqttClient } from "mqtt";
import { Logger } from "pino";

class MqttService {
    listeners: { [topic: string]: ((message: any) => void)[] } = {};
    connectListeners: (() => void)[] = [];

    constructor(
        private client: MqttClient,
        private logger: Logger,
        initialTopics: string[] = []
    ) {
        this.client.on("message", (topic, message) => {
            const messageString = message.toString();

            console.log(`Received message on topic ${topic}: ${messageString}`);
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
            this.connectListeners.forEach((listener) => listener());
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
        this.connectListeners.push(listener);
        if (callImmediately && this.connected()) {
            listener();
        }
    }

    send(topic: string, message: string) {
        try {
            this.client.publish(topic, message, {
                qos: 1,
            });
            this.logger.info(`MQTT/Send: ${topic}`);
        } catch (err) {
            console.error(err);
        }
    }
}

export default MqttService;
