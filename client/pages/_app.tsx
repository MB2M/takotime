import React from "react";
import "../styles/globals.css";
import "../styles/LiveDataWorkout.css";
import "../styles/LiveAthlete.css";
import "../styles/chevron.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { EventProvider } from "../context/event";
import { LiveDataProvider } from "../context/liveData/livedata";
import { CompetitionCornerProvider } from "../context/competitionCorner/data/competitionCorner";
import CompetitionProvider from "../context/competition/provider";
import Head from "next/head";
import MuiThemeProvider from "../context/MuiThemeProvider";

function MyApp({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);

    const isMT22 = useRouter().asPath.includes("mt22");
    if (isMT22) {
        return (
            <LiveDataProvider>
                <CompetitionCornerProvider>
                    <EventProvider>
                        <Component {...pageProps} />
                    </EventProvider>
                </CompetitionCornerProvider>
            </LiveDataProvider>
        );
    }

    return (
        <LiveDataProvider>
            <CompetitionProvider>
                <CompetitionCornerProvider>
                    <MuiThemeProvider>
                        <Head>
                            <title>Takotime App</title>
                            {/* <link rel="icon" href="/favicon.ico" /> */}
                        </Head>
                        <Component {...pageProps} />
                    </MuiThemeProvider>
                </CompetitionCornerProvider>
            </CompetitionProvider>
        </LiveDataProvider>
    );
}

export default MyApp;
