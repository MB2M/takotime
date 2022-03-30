import type { NextPage } from "next";
import Schedule from "../../components/live/Schedule";
import WebsocketWrapper from "../../components/live/WebSocketWrapper";

const planning: NextPage = () => {
    return (
        <WebsocketWrapper>
            <Schedule></Schedule>
        </WebsocketWrapper>
    );
};

export default planning;
