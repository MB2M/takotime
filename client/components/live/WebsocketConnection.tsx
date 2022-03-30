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
            url={`ws://${process.env.NEXT_PUBLIC_LIVE_API}`}
            onMessage={handleData}
            ref={ws}
        />
    );
};

export default WebsocketConnection;
