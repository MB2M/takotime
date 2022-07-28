import Overlay from "../../../components/live/overlay/Overlay";
import WebsocketWrapperLight from "../../../components/live/WebSocketWrapperLight";
import type { GetServerSideProps, NextPage } from "next";
import { useEventContext } from "../../../context/event";

const overlay: NextPage<Props> = ({ hostname }: { hostname: string | undefined }) => {
    const event = useEventContext()
    console.log(event)
    return (
        <>
            <WebsocketWrapperLight hostname={hostname}>
                <Overlay data={undefined} version={"duel-2"}></Overlay>
            </WebsocketWrapperLight>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
    req,
    res,
}) => {
    const hostname = req.headers.host?.split(":", 1)[0];
    return { props: { hostname: hostname || undefined } };
};

export default overlay;
