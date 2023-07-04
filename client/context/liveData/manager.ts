import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";

type TopicListener = (data: WebSocketReceivedMessage) => void;

const socketUrl = `ws://${
    typeof window !== "undefined" && window.location.hostname
}:3000`;

export const useLiveData = () => {
    const [workoutIds, setWorkoutIds] = useState<WorkoutIds[]>([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState<LiveWorkout[]>([]);
    const [stationDevices, setStationDevices] = useState<StationDevices[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [globals, setGlobals] = useState<Globals>();
    const [topicListener, setTopicListener] = useState(
        new Map<string, TopicListener[]>()
    );
    const { sendMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("opened ws connection"),
        onMessage: (message) => {
            handleData(JSON.parse(message.data));
        },
        onClose: () => console.log("closed ws connection"),
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: () => true,
        reconnectInterval: 2000,
        reconnectAttempts: 100,
    });

    const handleData = (data: WebSocketReceivedMessage) => {
        const topic = data.topic;
        const message = data.data;

        switch (topic) {
            case "stationUpdate":
                setStations(message);
                break;
            case "brokerUpdate":
                setBrokerClients(message);
                break;
            case "rank":
                setRanks(message);
                break;
            case "globalsUpdate":
                setGlobals(message);
                break;
            case "devicesConfig":
                setStationDevices(message);
                break;
            case "devices":
                setDevices(message);
                break;
            case "activeWorkoutList":
                setWorkoutIds(message);
                break;
            case "loadedWorkouts":
                setLoadedWorkouts(message);
                break;
            default:
                break;
        }

        topicListener.get(topic)?.forEach((listener) => listener(message));
    };

    const registerListener = useCallback(
        (topic: string, cb: (data: any) => void, notifyBackend = false) => {
            setTopicListener((t) =>
                t.set(topic, [...(t.get(topic) || []), cb])
            );
            if (notifyBackend) {
                sendMessage(
                    JSON.stringify({
                        topic: "register",
                        data: { topic },
                    })
                );
            }
            return () => {
                setTopicListener((t) => {
                    const currentListeners = t.get(topic);
                    if (!currentListeners || currentListeners.length === 0) {
                        t.delete(topic);
                        console.log(t);
                        return t;
                    }

                    return t.set(
                        topic,
                        currentListeners.filter((listener) => listener !== cb)
                    );
                });
            };
        },
        [sendMessage]
    );

    // const sendMessage = (message: string) => {
    //     console.log(ws?.current?.readyState);
    //     ws?.current?.sendMessage(message);
    // };

    return {
        workoutIds,
        loadedWorkouts,
        stationDevices,
        devices,
        stations,
        brokerClients,
        ranks,
        globals,
        registerListener,
        sendMessage,
        handleData,
    };
};
