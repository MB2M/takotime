import { Children, cloneElement, useRef, useState } from "react";
import WebsocketConnection from "./WebsocketConnection";

const WebsocketWrapper = ({ children }: any) => {
    const [workoutIds, setWorkoutIds] = useState<WorkoutIds[]>([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState<Workout[]>([]);
    const [stationDevices, setStationDevices] = useState<StationDevices[]>([]);
    const [stationStatics, setStationStatics] = useState<StationStatics[]>([]);
    const [stationDynamics, setStationDynamics] = useState<StationDynamics[]>(
        []
    );
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [globals, setGlobals] = useState<Globals>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

        switch (topic) {
            case "dynamicsUpdate":
                setStationDynamics(message);
                break;
            case "staticsUpdate":
                setStationStatics(message);
                break;
            case "brokerUpdate":
                setBrokerClients(message);
                break;
            case "rank":
                console.log(message)
                setRanks(message);
                break;
            case "globalsUpdate":
                setGlobals(message);
                break;
            case "devicesConfig":
                setStationDevices(message);
                break;
            case "workoutIds":
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

    const childrenWithProps = Children.map(children, (child, index) => {
        return cloneElement(child, {
            workoutIds,
            loadedWorkouts,
            stationDevices,
            stationStatics,
            stationDynamics,
            brokerClients,
            ranks,
            globals,
            sendMessage,
        });
    });

    console.log(globals);
    return (
        <>
            <WebsocketConnection handleData={handleData} ws={ws} />
            <div>{childrenWithProps}</div>
        </>
    );
};

export default WebsocketWrapper;
