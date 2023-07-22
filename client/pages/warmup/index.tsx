import { useEventContext } from "../../context/event";

const Warmup = () => {
    const { eventId } = useEventContext();

    return <h1>{eventId}</h1>;
};

export default Warmup;
