import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import liveApp from "..";

class WebsocketServices {
    wss: WebSocketServer;
    onMessageListeners: Array<(data: Buffer) => void>;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
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

            const stations = await liveApp.manager.getAllStations();
            this.sendToClient(ws, "stationUpdate", stations);

            const globals = await liveApp.manager.getGlobals();
            this.sendToClient(ws, "globalsUpdate", globals);

            const stationDevicesList =
                await liveApp.manager.getAllStationDevices();
            this.sendToClient(ws, "devicesConfig", stationDevicesList);

            const workoutIds = await liveApp.manager.getAllWorkouts();
            this.sendToClient(ws, "activeWorkoutList", workoutIds);

            const workouts = await liveApp.manager.getLoadedWorkouts();
            this.sendToClient(ws, "loadedWorkouts", workouts);

            // const clients = await liveApp.manager.getAllBrokerClient();
            // this.sendToClient(ws, "brokerUpdate", clients);

            liveApp.manager.publishRank();
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
