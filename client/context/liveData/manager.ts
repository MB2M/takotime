import { useState, useRef } from "react";

export const useLiveData = () => {
    const [workoutIds, setWorkoutIds] = useState<WorkoutIds[]>([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState<Workout[]>([]);
    const [stationDevices, setStationDevices] = useState<StationDevices[]>([]);
    const [station, setStation] = useState<Station[]>([]);
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [globals, setGlobals] = useState<Globals>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

        switch (topic) {
            case "stationUpdate":
                setStation(message);
                break;
            case "brokerUpdate":
                setBrokerClients(message);
                break;
            case "rank":
                setRanks(message);
                break;
            case "globalsUpdate":
                console.log(message)
                setGlobals(message);
                break;
            case "devicesConfig":
                setStationDevices(message);
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
        ws?.current?.sendMessage(message);
    };

    return {
        workoutIds,
        loadedWorkouts,
        stationDevices,
        station,
        brokerClients,
        ranks,
        globals,
        sendMessage,
        handleData,
        ws,
    };
};
