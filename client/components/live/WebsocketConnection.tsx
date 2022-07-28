import { WebSocket } from "nextjs-websocket";
import { MutableRefObject } from "react";

const WebsocketConnection = ({
    handleData,
    ws,
    hostname,
}: {
    handleData: (data: string) => void;
    ws: MutableRefObject<WebSocket | undefined>;
    hostname: string | undefined;
}) => {
    return (
        <WebSocket
            url={`ws://${process.env.NEXT_PUBLIC_LIVE_API}`}
            onMessage={handleData}
            ref={ws}
        />
    );
};

export default WebsocketConnection;
