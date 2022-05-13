import type { GetServerSideProps, NextPage } from "next";
import WebsocketWrapper from "../../components/live/WebSocketWrapper";
import Dashboard from "../../components/dashboard2";


const Test: NextPage<Props> = ({ hostname }: { hostname: string | undefined }) => {
    return (
        <WebsocketWrapper hostname={hostname}>
            <Dashboard></Dashboard>
        </WebsocketWrapper>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
    req,
    res,
}) => {
    console.log(req.headers.host);
    const hostname = req.headers.host?.split(":", 1)[0];
    return { props: { hostname: hostname || undefined } };
};

export default Test;
