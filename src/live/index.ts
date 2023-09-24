import { WebSocketServer } from "ws";
import LiveSystem from "./libs/LiveSystem";
import MqttServices from "./services/mqttServices";
import WodTimer from "../lib/timer/WodTimer";
import keyvMongo from "./services/keyvMongo";
import WebsocketServices from "./services/websocketServices";
import { MqttClient } from "mqtt";
import mqttServices from "./libs/mqttConnect";
import IpConfigService from "./services/ipConfig.service";
import ipConfig from "./models/IpConfig";

const ipConfigService = new IpConfigService(ipConfig);

export const startLiveApp = (wss: WebSocketServer) => {
    // const wodTimerServices = new WodTimer();
    // const mqttServices = new MqttServices(mqttClient, mqttTopics);
    // const websocketServices = new WebsocketServices(wss);
    return new LiveSystem(
        {
            // wodTimerServices,
            mqttServices,
            ipConfigService,
        }
        // keyvMongo()
        // websocketServices
    );
};
