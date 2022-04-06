import { Router, Express } from "express";
import router from "./web/routes";
import mqttBroker from "./libs/mqttBroker";
import config from "../config";
import { WebSocketServer } from "ws";
import { Server } from "http";
import Manager from "./libs/manager";
import MqttServices from "./services/mqttServices";
import WodTimerServices from "./services/WodTimerServices";
import keyvMongo from "./services/keyvMongo";
import WebsocketServices from "./services/websocketServices";
import { Aedes, Subscription } from "aedes";

const brokerPort = config.brokerPort;
const brokerDatabase = config.mongopAedesUrl;

class LiveApp {
    routes: Router;
    expressApp!: Express;
    wss!: WebSocketServer;
    manager!: Manager;

    constructor() {
        // this.expressApp = expressApp;
        // this.wss = new WebSocketServer({ server });
        this.routes = router;
    }

    async start(
        expressApp: Express,
        server: Server,
        endpoint: string = "/live"
    ) {
        this.expressApp = expressApp;
        this.expressApp.use(endpoint, this.routes);
        // this.initMqttBroker();
        // this.managerInit(server);
    }

    async initMqttBroker(): Promise<boolean> {
        if (!brokerPort) {
            throw "Port number is missing";
        }
        mqttBroker.start(parseInt(brokerPort), brokerDatabase);

        mqttBroker.socket.on("clientReady", (client) => {
            this.manager.brokerClientUpdate(client);
        });

        mqttBroker.socket.on("clientDisconnect", (client) => {
            this.manager.brokerClientUpdate(client);
        });

        mqttBroker.socket.on("subscribe", (subscriptions: Subscription[]) => {
            if (subscriptions[0]?.topic === "server/wodConfig") {
                this.manager.sendFullConfig("server/wodConfig");
            }
        });

        return true;
    }

    async initWebsocket(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.wss.on("connection", function connection(ws) {
            ws.on("message", function message(data) {
                const json = JSON.parse(data.toString());
                const topic = json.topic;
                const message = json.message;
                if (topic === "client/scriptReset") {
                    console.log("scriptReset");
                    global.liveWodManager.sendToChannel(
                        "server/scriptReset",
                        null,
                        message
                    );
                }
                if (topic === "client/restartUpdate") {
                    global.liveWodManager.sendToChannel(
                        "server/restartUpdate",
                        null,
                        message
                    );
                }
            });
            // sender.sendStaticsToAllClients();
            // sender.sendStationStatusToAllClients();
            // sender.sendGlobalsToAllClients();
            // sender.sendStationDevicesToAllClients();
            // sender.sendWorkoutsToAllClients();
            // sender.sendLoadedWorkoutsToAllClients();
            // sender.sendDynamicsToAllClients();
        });
    }

    async managerInit(server: Server) {
        const wodTimerServices = new WodTimerServices();
        const mqttServices = new MqttServices(
            mqttBroker.socket as AedesWithClients<Aedes>
        );
        const websocketServices = new WebsocketServices(server);
        this.manager = new Manager(
            wodTimerServices,
            mqttServices,
            keyvMongo(),
            websocketServices
        );
    }
}

const liveApp = new LiveApp();
// liveApp.start();

export default liveApp;
