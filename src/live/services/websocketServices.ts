import { WebSocket, WebSocketServer } from "ws";
import { liveApp } from "../../app";

class WebsocketServices {
    wss: WebSocketServer;
    onMessageListeners: Array<(data: Buffer) => void>;

    constructor(wss: WebSocketServer) {
        this.wss = wss;
        this.onMessageListeners = [];
        this.onConnection();
    }

    addOnMessage(listener: (data: Buffer) => void) {
        this.onMessageListeners.push(listener);
    }

    onConnection() {
        this.wss.on("connection", async (ws) => {
            this.onMessageListeners.forEach((f) => {
                ws.on("message", f);
            });

            const stations = await liveApp.getAllStations();
            this.sendToClient(ws, "stationUpdate", stations);

            const globals = await liveApp.getGlobals();
            this.sendToClient(ws, "globalsUpdate", globals);

            const stationDevicesList = await liveApp.getAllStationDevices();
            this.sendToClient(ws, "devicesConfig", stationDevicesList);

            const workoutIds = await liveApp.getAllWorkouts();
            this.sendToClient(ws, "activeWorkoutList", workoutIds);

            const workouts = await liveApp.getLoadedWorkouts();
            this.sendToClient(ws, "loadedWorkouts", workouts);

            const devices = await liveApp.getAllDevices();
            this.sendToClient(ws, "devices", devices);

            // const clients = await liveApp.getAllBrokerClient();
            // this.sendToClient(ws, "brokerUpdate", clients);

            liveApp.publishRank();
        });
    }

    sendToAllClients(topic: string, data: any) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        topic: topic,
                        data: data,
                    })
                );
            }
        });
    }

    sendToClient(client: WebSocket, topic: string, data: any) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    topic: topic,
                    data: data,
                })
            );
        }
    }
}

export default WebsocketServices;
