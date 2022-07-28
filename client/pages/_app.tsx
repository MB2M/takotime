import React from "react";
import "../styles/globals.css";
import "../styles/LiveDataWorkout.css";
import "../styles/LiveAthlete.css";
import "../styles/chevron.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { EventProvider } from "../context/event";
import { LiveDataProvider } from "../context/liveData/livedata";

function MyApp({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);

    const isMT22 = useRouter().asPath.includes("mt22");
    if (isMT22) {
        return (
            <LiveDataProvider>
                <EventProvider>
                    <Component {...pageProps} />
                </EventProvider>
            </LiveDataProvider>
        );
    }
    return (
        <LiveDataProvider>
            <Component {...pageProps} />
        </LiveDataProvider>
    );
}

export default MyApp;
