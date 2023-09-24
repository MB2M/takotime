import MqttServices from "../live/services/mqttServices";
import type { WebSocketServer } from "ws";
import WodTimer from "../lib/timer/WodTimer";
import type { MqttClient } from "mqtt";
import LiveSystem from "../live/libs/LiveSystem";

export class LiveSystemFactory {
    private liveSystems: LiveSystem[] = [];
    private readonly wss: WebSocketServer;
    private readonly mqttClient: MqttClient;

    constructor({
        wss,
        mqttClient,
    }: {
        wss: WebSocketServer;
        mqttClient: MqttClient;
    }) {
        this.wss = wss;
        this.mqttClient = mqttClient;
    }

    private create(id: string) {
        const timer = new WodTimer();
        const mqttServices = new MqttServices(this.mqttClient);
        const liveSystem = new LiveSystem({
            id,
            timer,
            mqttServices,
        });
        this.liveSystems.push(liveSystem);
        return liveSystem;
    }

    public get(id: string) {
        return (
            this.liveSystems.find(
                (liveSystem) => liveSystem.getId(id) === id
            ) || this.create(id)
        );
    }
}
