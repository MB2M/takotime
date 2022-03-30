import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import LiveDataWorkout from "../../../components/live/screen/old/LiveDataWorkout";
import WebsocketWrapper from "../../../components/live/WebSocketWrapper";

const widescreen: NextPage = () => {
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
            <WebsocketWrapper>
                <LiveDataWorkout broadcast={"bigscreen"}></LiveDataWorkout>
            </WebsocketWrapper>
            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
        </>
    );
};

export default widescreen;
