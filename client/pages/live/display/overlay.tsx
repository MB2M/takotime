import type { NextPage } from "next";
import Overlay from "../../../components/live/overlay/Overlay";
import WebsocketWrapperLight from "../../../components/live/WebSocketWrapperLight";

const overlay: NextPage = () => {
    return (
        <>
            <WebsocketWrapperLight>
                <Overlay data={undefined}></Overlay>
            </WebsocketWrapperLight>
        </>
    );
};

export default overlay;
