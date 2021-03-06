import Head from "next/head";
import Script from "next/script";
import WebsocketWrapperLight from "../../../components/live/WebSocketWrapperLight";
import WidescreenVertical from "../../../components/live/Vscreen/WidescreenVertical";
import type { GetServerSideProps, NextPage } from "next";

const widescreen: NextPage<Props> = ({ hostname }: { hostname: string | undefined }) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                    crossOrigin="anonymous"
                />
            </Head>
            <WebsocketWrapperLight hostname={hostname}>
                <WidescreenVertical data={undefined}></WidescreenVertical>
            </WebsocketWrapperLight>
            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
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
