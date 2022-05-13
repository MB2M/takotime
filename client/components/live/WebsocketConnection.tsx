import { WebSocket } from "nextjs-websocket";
import { MutableRefObject } from "react";


const WebsocketConnection = ({
    handleData,
    ws,
}: {
    handleData: (data: string) => void;
    ws: MutableRefObject<WebSocket | undefined>;
}) => {
    return (
        <WebSocket
            url={`ws://${window.location.hostname}:3001`}
            onMessage={handleData}
            ref={ws}
        />
    );
};

export default WebsocketConnection;
