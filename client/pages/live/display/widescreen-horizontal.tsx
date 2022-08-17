import Head from "next/head";
import Script from "next/script";
import WebsocketWrapperLight from "../../../components/live/WebSocketWrapperLight";
import WidescreenHorizontal from "../../../components/live/Hscreen/WidescreenHorizontal";
import type { GetServerSideProps, NextPage } from "next";

const widescreen: NextPage<Props> = ({
    hostname,
}: {
    hostname: string | undefined;
}) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

            </Head>
            {/* <WebsocketWrapperLight hostname={hostname}> */}
            <WidescreenHorizontal withTako={true}></WidescreenHorizontal>
            {/* </WebsocketWrapperLight> */}

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

export default widescreen;
