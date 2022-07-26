import { WebSocket } from "nextjs-websocket";
import { MutableRefObject } from "react";

const WebsocketConnection = ({
    handleData,
    ws,
    hostname,
}: {
    handleData: (data: string) => void;
    ws: MutableRefObject<WebSocket | undefined>;
    hostname: string | null;
}) => {
    return (
        <WebSocket
            url={`ws://${hostname}:3000`}
            onMessage={handleData}
            ref={ws}
        />
    );
};

export default WebsocketConnection;
