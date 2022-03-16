import WebSocket from "ws";

class WebsocketSender {
    wss: WebSocket.Server<WebSocket.WebSocket>;

    constructor(wss: WebSocket.Server<WebSocket.WebSocket>) {
        this.wss = wss;
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

    sendStationDataToAllClients() {
        this.sendToAllClients(
            "stationUpdate",
            global.liveWodManager.wod.db.getData("/stations")
        );
    }

    sendStationDevicesToAllClients() {
        this.sendToAllClients(
            "devicesConfig",
            global.liveWodManager.stationDevicesDb.getData("/stationDevices")
        );
    }

    sendGlobalsToAllClients() {
        this.sendToAllClients(
            "globalsUpdate",
            global.liveWodManager.wod.db.getData("/globals")
        );
    }

    sendStationStatusToAllClients() {
        let clients = {};
        Object.entries(
            global.liveWodManager.mqttBroker.socket.clients as object
        ).forEach(([k, v]) => {
            clients = { ...clients, [k]: v.connected };
        });

        this.sendToAllClients("brokerUpdate", clients);
    }
}

export default WebsocketSender;
