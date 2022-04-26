import type { NextPage } from "next";
import Overlay from "../../../components/live/overlay/Overlay";
import WebsocketWrapperLight from "../../../components/live/WebSocketWrapperLight";

const overlay: NextPage = () => {
    return (
        <>
            <WebsocketWrapperLight>
                <Overlay data={undefined} version={"duel"}></Overlay>
            </WebsocketWrapperLight>
        </>
    );
};

export default overlay;
