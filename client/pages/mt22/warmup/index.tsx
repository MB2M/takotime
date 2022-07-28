import { createContext, useContext } from "react";
import { LivedataContext, useEventContext } from "../../../context/event";

const Warmup = () => {
    const { eventId } = useEventContext();

    return <h1>{eventId}</h1>;
};

export default Warmup;
