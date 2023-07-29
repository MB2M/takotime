import { WebSocket, WebSocketServer } from "ws";
import {
    addScore,
    addTimerScore,
    getAllStationsInfo,
    getStationInfo,
    resetScores,
    saveCC,
} from "./scoringService";
import liveApp from "../../live";
import Competition from "../models/Competition";
import { IWorkout } from "../../types/competition";

interface RegisterData {
    topic: string;
}

let currentWorkouts: IWorkout[] = [];
const refreshCurrentWorkouts = async () => {
    currentWorkouts = (await Competition.findOne({ selected: true }).exec())
        ?.workouts as IWorkout[];
};

refreshCurrentWorkouts().then();

export default class WebsocketScoringService {
    wss: WebSocketServer;
    listeners: Map<string, Set<WebSocket>> = new Map();

    constructor(wss: WebSocketServer) {
        this.wss = wss;
        this.wss.on("connection", (ws) => {
            this.onConnection(ws);
            ws.on("close", async () => {
                await this.onClose(ws);
            });
        });
        liveApp.manager.on(
            "updateResults",
            async (heatId, laneNumber, participantId, result) => {
                await this.onResult(heatId, laneNumber, participantId, result);
            }
        );

        liveApp.manager.on("startWod", async (workoutId, heatId, reset) => {
            if (reset) await this.onReset();
            await refreshCurrentWorkouts();
        });

        liveApp.manager.on("stationUpdate", async () => {
            this.sendStationDataToAll();
        });
    }

    onConnection(ws: WebSocket) {
        ws.on("message", (message) => {
            const json = JSON.parse(message.toString());
            const topic = json.topic;
            const data = json.data;

            this.onMessage(ws, topic, data);
        });
    }
    sendToRegistered(topic: string, data: any) {
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

    sendStationDataToAll() {
        this.listeners.forEach(async (client, key) => {
            if (key === "station") {
                const stations = await getAllStationsInfo();
                return client.forEach((client) =>
                    client.send(
                        JSON.stringify({ topic: "station", data: stations })
                    )
                );
            }

            const laneNumber = key.split("/")[1];

            if (!laneNumber || isNaN(+laneNumber)) return;

            const station = await getStationInfo(+laneNumber);
            this.sendToRegistered(key, station);
        });
    }

    onMessage(ws: WebSocket, topic: string, data: any) {
        this.sendToRegistered(topic, data);

        if (topic === "register") {
            this.onRegister(ws, data).then();
        }

        if (topic === "newRep") {
            this.onNewRep(data).then();
        }

        if (topic === "save") {
            this.onSave(ws, data).then();
        }
    }

    async onRegister(ws: WebSocket, data: RegisterData) {
        const current = this.listeners.get(data.topic) || new Set();
        this.listeners.set(data.topic, current?.add(ws));

        if (data.topic === "station") {
            const stations = await getAllStationsInfo();
            return ws.send(
                JSON.stringify({ topic: "station", data: stations })
            );
        }

        const laneNumber = data.topic.split("/")?.[1];

        if (laneNumber) {
            const station = await getStationInfo(+laneNumber);
            this.sendToRegistered(data.topic, station);
        }
    }

    async onClose(ws: WebSocket) {
        this.listeners.forEach((setOfListeners, topic) => {
            if (setOfListeners.has(ws)) {
                setOfListeners.delete(ws);
                if (setOfListeners.size === 0) {
                    this.listeners.delete(topic);
                } else {
                    this.listeners.set(topic, setOfListeners);
                }
            }
        });
    }

    async onNewRep(data: any) {
        const laneNumber = data.station;
        const value = data.value;
        const index = data.wodIndex;
        const participantId = data.participantId;
        const movementIndex = data.movementIndex;
        const round = data.round;
        const category = data.category;
        const heatId = data.heatId;

        const workout = currentWorkouts.find(
            (w) =>
                w.workoutId === index &&
                (category ? w.categories.includes(category) : true)
        );

        if (!workout) return;

        try {
            const s1 = Date.now();
            const newRep = await addScore(
                value,
                index,
                laneNumber,
                workout,
                heatId,
                {
                    participantId,
                    movementIndex,
                    round,
                    category,
                }
            );
            console.log("durée ajout reps S1:", Date.now() - s1);

            // const s2 = Date.now();
            if (newRep) this.sendToRegistered(`station/${laneNumber}`, newRep);
            // console.log("duration S2:", (Date.now() - s2) / 1000);
        } catch (err: any) {
            console.log(err.message);
        }
    }

    async onResult(
        heatId: string,
        laneNumber: number,
        participantId: string,
        results: {
            id: number;
            value: number;
            method: string;
            shortcut: boolean;
            tieBreak: {
                value: number;
                method: string;
            };
        }[]
    ) {
        await addTimerScore(
            results.map((result) => result.value),
            laneNumber
        );

        const station = await getStationInfo(laneNumber);

        this.sendToRegistered(`station/${laneNumber}`, station);
    }

    async onSave(ws: WebSocket, data: any) {
        const laneNumber = data.laneNumber;

        if (!laneNumber) return;
        const station = (await liveApp.manager.getAllStations()).find(
            (station) => station.laneNumber === +laneNumber
        );

        const { error, success } = await saveCC(
            +laneNumber,
            undefined,
            station?.category
        );

        if (error)
            ws.send(
                JSON.stringify({
                    topic: `postScore/${laneNumber}`,
                    data: "error",
                })
            );

        if (success)
            ws.send(
                JSON.stringify({
                    topic: `postScore/${laneNumber}`,
                    data: "success",
                })
            );
    }

    async onReset() {
        await resetScores();
    }
}
