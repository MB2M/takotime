import { Stack, Box, Typography } from "@mui/material";
import { useMemo } from "react";
import Chrono from "./Chrono";
import Logo from "./Logo";
import Title from "./Title";

const BigscreenBar = ({
    position,
    height,
    competition,
    options,
    heat,
    chrono,
}: {
    position: "top" | "bottom";
    height: number;
    competition?: Competition;
    options?: WorkoutOption;
    heat?: CCHeat;
    chrono?: string;
}) => {
    const showHeader = useMemo(
        () =>
            (competition &&
                options?.logo &&
                options?.logoPosition?.includes(position)) ||
            (options?.title && options?.titlePosition?.includes(position)) ||
            (options?.chrono && options?.chronoPosition?.includes(position)),
        [options]
    );

    const logoUrl = useMemo(
        () => (options?.logo ? `/img/${competition?.logoUrl}` : ""),
        [options?.logo]
    );

    const titles = useMemo(() => {
        if (!options?.title) return { textTop: "", textBottom: "" };
        switch (options?.titleType) {
            case "category":
                return {
                    textTop: heat?.divisions.join(" / "),
                };

            case "heat":
                return { textTop: heat?.title };

            case "category-heat":
                return {
                    textTop: heat?.divisions.join(" / "),
                    textBottom: heat?.title,
                };

            case "heat-category":
                return {
                    textTop: heat?.title,
                    textBottom: heat?.divisions.join(" / "),
                };
            default:
                return { textTop: "", textBottom: "" };
        }
    }, [heat, options?.titleType, options?.title]);

    if (!showHeader) return null;

    const headerNodes = [
        options?.logo && options?.logoPosition?.includes(position) && (
            <Logo logo={logoUrl} logoWidth="200px" />
        ),
        options?.title && options?.titlePosition?.includes(position) && (
            <Title {...titles} />
        ),
        options?.chrono && options?.chronoPosition?.includes(position) && (
            <Chrono reverse={options.chronoDirection === "desc"}/>
        ),
    ];

    return (
        <Stack direction="row" color={"white"} height={height} >
            {(options?.logoPosition?.includes("Left")
                ? headerNodes
                : headerNodes.reverse()
            ).map((node, index) => (
                <Box
                    ml={index === 2 ? "auto" : ""}
                    mr={index === 2 ? "30px" : ""}
                >
                    {node}
                </Box>
            ))}
        </Stack>
    );
};

export default BigscreenBar;
