import { useRouter } from "next/router";
import {
    Children,
    createContext,
    ReactNode,
    useContext,
    useReducer,
} from "react";
import WebsocketConnection from "../../components/live/WebsocketConnection";
import { useLiveData } from "./manager";

const DEFAULT_EVENT_CONTEXT_VALUE: LiveDataState = {
    workoutIds: [],
    loadedWorkouts: [],
    stationDevices: [],
    station: [],
    brokerClients: {},
    ranks: [],
    globals: {
        wodname: "",
        duration: 0,
        startTime: "",
        countdown: 0,
        externalEventId: 0,
        externalHeatId: 0,
        remoteWarmupHeat: 0,
        remoteFinaleAthlete: 0,
    },
    sendMessage: () => undefined,
    handleData: () => undefined,
};

export interface LiveDataState {
    workoutIds: WorkoutIds[];
    loadedWorkouts: Workout[];
    stationDevices: StationDevices[];
    station: Station[];
    brokerClients: Broker;
    ranks: StationRanked;
    globals: Globals | undefined;
    sendMessage: (message: string) => void;
    handleData: (data: string) => void;
}

export const LiveDataContext = createContext<LiveDataState>(
    DEFAULT_EVENT_CONTEXT_VALUE
);

export const LiveDataProvider = ({ children }: { children: ReactNode }) => {
    const liveData = useLiveData();
    const hostname = process.env.NEXT_PUBLIC_LOCAL_HOSTNAME;

    return (
        <LiveDataContext.Provider value={liveData}>
            <WebsocketConnection
                handleData={liveData.handleData}
                ws={liveData.ws}
                hostname={hostname}
            />
            {children}
        </LiveDataContext.Provider>
    );
};

export const useLiveDataContext = () => {
    return useContext(LiveDataContext);
};
