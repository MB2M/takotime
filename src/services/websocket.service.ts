import { WebSocket, WebSocketServer } from "ws";
import { Logger } from "pino";
import { IncomingMessage } from "http";

type ServerListener = (message: any) => void;

export default class WebsocketService {
    listeners: Map<string, Set<WebSocket>> = new Map();
    serverListeners: { [topic: string]: ServerListener[] } = {};
    constructor(private wsServer: WebSocketServer, private logger: Logger) {
        this.wsServer.on("connection", this._onConnection.bind(this));
    }

    serverSubscribe(topic: string, listener: ServerListener) {
        this.serverListeners[topic] ??= [];
        this.serverListeners[topic].push(listener);
    }

    send(topic: string, data: any) {
        const registered = this.listeners.get(topic) || [];

        const baseLevel = topic?.split("/")[0]!;
        const topLevelRegistered = this.listeners.get(baseLevel) || [];

        registered?.forEach((client) => {
            client.send(JSON.stringify({ topic, data }));
        });

        topLevelRegistered?.forEach((client) => {
            client.send(JSON.stringify({ topic: "station", data }));
        });
    }

    sendToAll(data: any) {
        const stringData = JSON.stringify(data);
        // console.log(stringData);
        this.wsServer.clients.forEach((client) => {
            client.send(stringData);
        });
    }

    private _onConnection(ws: WebSocket, req: IncomingMessage) {
        this.logger.info(
            `Websocket: new client connected [${this.wsServer.clients.size}]`
        );
        ws.on("message", (message) => {
            const json = JSON.parse(message.toString());
            const { topic, data } = json;

            this._onMessage(ws, topic, data);
        });

        ws.on("close", (code) => {
            this._unregister(ws);
            this.logger.info(
                `Websocket: a client disconnected [${this.wsServer.clients.size}]`
            );
        });
    }
    private _onServerClose() {
        this.listeners.clear();
        this.logger.info("Websocket server closed");
    }

    private _onMessage(ws: WebSocket, topic: string, data: any) {
        switch (topic) {
            case "register":
                this._subscribe(ws, data);
                break;
            default:
                this.serverListeners[topic]?.forEach((listener) =>
                    listener(data)
                );
                break;
        }
    }

    private _subscribe(ws: WebSocket, data: WebsocketRegisterData) {
        const current = this.listeners.get(data.topic);

        if (!current) {
            this.listeners.set(data.topic, new Set([ws]));
        } else {
            if (current.has(ws)) return;
            current.add(ws);
        }

        this.logger.info(`Client ${ws} subscribed to topic ${data.topic}`);
    }

    private _unregister(ws: WebSocket, topics: string[] = []) {
        this.listeners.forEach((setOfListeners, topic) => {
            if (topics.length === 0 || topics.includes(topic)) {
                if (setOfListeners.has(ws)) {
                    setOfListeners.delete(ws);
                    if (setOfListeners.size === 0) {
                        this.listeners.delete(topic);
                    } else {
                        this.listeners.set(topic, setOfListeners);
                    }
                }
            }
        });
    }
}
