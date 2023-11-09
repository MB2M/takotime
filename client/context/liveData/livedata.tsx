import { createContext, ReactNode, useContext } from "react";
import { useLiveData } from "./manager";
import { ReadyState } from "react-use-websocket/dist/lib/constants";

const DEFAULT_EVENT_CONTEXT_VALUE: LiveDataState = {
    workoutIds: [],
    loadedWorkouts: [],
    stationDevices: [],
    devices: [],
    stations: [],
    brokerClients: {},
    ranks: [],
    globals: {
        wodname: "",
        duration: 0,
        startTime: "",
        countdown: 0,
        externalEventId: 0,
        externalWorkoutId: 0,
        externalHeatId: 0,
        remoteWarmupHeat: 0,
        remoteFinaleAthlete: 0,
        state: 0,
    },
    sendMessage: () => undefined,
    handleData: () => undefined,
    registerListener: () => () => undefined,
    readyState: 0,
};

export interface LiveDataState {
    workoutIds: WorkoutIds[];
    loadedWorkouts: LiveWorkout[];
    stationDevices: StationDevices[];
    stations: Station[];
    devices: Device[];
    brokerClients: Broker;
    ranks: StationRanked;
    globals: Globals | undefined;
    sendMessage: (message: string) => void;
    handleData: (data: WebSocketReceivedMessage) => void;
    registerListener: (
        topic: string,
        callback: (data: any) => void,
        notifyBackend?: boolean
    ) => () => void;
    readyState: ReadyState;
    // ws?: MutableRefObject<WebSocket | undefined>;
}

export const LiveDataContext = createContext<LiveDataState>(
    DEFAULT_EVENT_CONTEXT_VALUE
);

export const LiveDataProvider = ({ children }: { children: ReactNode }) => {
    const liveData = useLiveData();

    return (
        <LiveDataContext.Provider value={liveData}>
            {children}
        </LiveDataContext.Provider>
    );
};

export const useLiveDataContext = () => {
    return useContext<LiveDataState>(LiveDataContext);
};
