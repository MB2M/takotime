import React, { PropsWithChildren } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCompetitionContext } from "./competition";
import { blue, purple } from "@mui/material/colors";
import { PaletteOptions, responsiveFontSizes } from "@mui/material";

declare module "@mui/material/styles" {
    interface Theme {
        palette: {
            primary: { main: string };
            secondary: { main: string };
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        palette?: PaletteOptions;
    }
}
const MuiThemeProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
    const competition = useCompetitionContext();

    const theme = createTheme({
        palette: {
            primary: {
                main: competition?.primaryColor || blue[500],
            },
            secondary: {
                main: competition?.secondaryColor || purple[500],
            },
        },
    });

    if (!theme) return <>{children}</>;

    return (
        <ThemeProvider theme={responsiveFontSizes(theme)}>
            {children}
        </ThemeProvider>
    );
};

export default MuiThemeProvider;
