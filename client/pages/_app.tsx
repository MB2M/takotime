import React from "react";
import "../styles/globals.css";
import "../styles/LiveDataWorkout.css";
import "../styles/LiveAthlete.css";
import "../styles/chevron.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
