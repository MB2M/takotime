import type { NextPage } from "next";
import WebsocketWrapper from "../../components/live/WebSocketWrapper";
import Dashboard from "../../components/dashboard2";

const Test: NextPage = () => {
    return (
        <WebsocketWrapper>
            <Dashboard></Dashboard>
        </WebsocketWrapper>
    );
};

export default Test;
