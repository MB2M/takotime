import LiveSystem from "./libs/LiveSystem";
import IpConfigService from "./services/ipConfig.service";
import ipConfig from "./models/IpConfig";
import { StationFactoryService } from "./services/stationFactory.service";
import { EventFactoryService } from "./services/eventFactory.service";
import LiveController from "./web/controllers/live.controller";
import { WebSocketServer } from "ws";
import WebsocketService from "../services/websocket.service";
import logger from "../config/logger";
import { loadMqttRoute } from "../mqttRouting";
import mqttServices from "./libs/mqttConnect";

const ipConfigService = new IpConfigService(ipConfig);

// const scoreFactory = new ScoreFactoryService();
const stationFactory = new StationFactoryService();
const eventFactory = new EventFactoryService(stationFactory);
export const liveController = new LiveController();

export const startLiveApp = (wss: WebSocketServer) => {
    const websocketService = new WebsocketService(wss, logger);
    const liveSystem = new LiveSystem({
        ipConfigService,
        eventFactory,
        websocketService,
    });
    loadMqttRoute(mqttServices, liveSystem);
    // const mqttController = new MqttController(mqttServices, liveSystem);
    // const wodTimerServices = new WodTimer();
    // const mqttServices = new MqttServices(mqttClient, mqttTopics);
    return liveSystem;
};
