import {
    Children,
    createContext,
    ReactNode,
    useContext,
    useReducer,
} from "react";

const DEFAULT_EVENT_INFO = {
    eventId: "7182",
    currentHeatId: "249200",
};

const DEFAULT_EVENT_CONTEXT_VALUE = {
    eventId: "",
    currentHeatId: "",
};

export const EventContext = createContext(DEFAULT_EVENT_CONTEXT_VALUE);

const reducer = (state: any, action: { type: any; value: any }) => {
    switch (action.type) {
        case "setEvent":
            return { ...state, event: action.value };
        default: {
            return state;
        }
    }
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [eventInfo, dispatch] = useReducer(reducer, DEFAULT_EVENT_INFO);
    return (
        <EventContext.Provider value={eventInfo}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    return useContext(EventContext);
};
