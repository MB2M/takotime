import { useState, useRef } from "react";

export const useLiveData = () => {
    const [workoutIds, setWorkoutIds] = useState<WorkoutIds[]>([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState<LiveWorkout[]>([]);
    const [stationDevices, setStationDevices] = useState<StationDevices[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [globals, setGlobals] = useState<Globals>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

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
    };

    const sendMessage = (message: string) => {
        ws?.current?.readyState;
        ws?.current?.sendMessage(message);
    };

    return {
        workoutIds,
        loadedWorkouts,
        stationDevices,
        devices,
        stations,
        brokerClients,
        ranks,
        globals,
        sendMessage,
        handleData,
        ws,
    };
};
