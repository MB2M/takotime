import { Box, Stack } from "@mui/material";
import { useMemo } from "react";
import Chrono from "./Chrono";
import Logo from "./Logo";
import Title from "./Title";
import useHeatDivisionInfo from "../../hooks/cc/useHeatDivisionInfo";

const BigscreenBar = ({
    position,
    height,
    competition,
    options,
    customTitle,
}: {
    position: "top" | "bottom";
    height: number;
    competition?: Competition;
    options?: WorkoutOption;
    chrono?: string;
    customTitle?: string;
}) => {
    const { heatName, divisions } = useHeatDivisionInfo();

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
        () => (options?.logo ? `/api/images/${competition?.logoUrl}` : ""),
        [options?.logo]
    );

    const titles = useMemo(() => {
        if (!options?.title) return { textTop: "", textBottom: "" };
        if (customTitle) return { textTop: customTitle, textBottom: "" };
        switch (options?.titleType) {
            case "category":
                return {
                    textTop: divisions.join(" / "),
                };

            case "heat":
                return {
                    textTop: heatName,
                    fontFamily: competition?.customFont,
                    textTopFontsize: "4rem",
                };

            case "category-heat":
                return {
                    textTop: divisions.join(" / "),
                    textBottom: heatName,
                };

            case "heat-category":
                return {
                    textTop: heatName,
                    textBottom: divisions.join(" / "),
                };
            default:
                return { textTop: "", textBottom: "" };
        }
    }, [heatName, divisions, options?.titleType, options?.title, customTitle]);

    if (!showHeader) return null;

    const headerNodes = [
        options?.logo && options?.logoPosition?.includes(position) && (
            <Logo logo={logoUrl} logoWidth="90px" />
        ),
        options?.title && options?.titlePosition?.includes(position) && (
            <Title {...titles} />
        ),
        options?.chrono && options?.chronoPosition?.includes(position) && (
            <Chrono
                reverse={options.chronoDirection === "desc"}
                fontSize={"4.5rem"}
            />
        ),
    ];

    return (
        <Stack direction="row" color={"white"} height={height} fontWeight={600}>
            {(options?.logoPosition?.includes("Left")
                ? headerNodes
                : headerNodes.reverse()
            ).map((node, index) => (
                <Box
                    key={index}
                    ml={index === 2 ? "auto" : index === 1 ? "auto" : "20px"}
                    mr={index === 2 ? "30px" : ""}
                >
                    {node}
                </Box>
            ))}
        </Stack>
    );
};

export default BigscreenBar;
