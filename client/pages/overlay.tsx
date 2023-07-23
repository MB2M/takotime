import { Box, Theme, Typography } from "@mui/material";
import React, { useMemo } from "react";

import withDisplayData from "../utils/withDisplayData";
import Image from "next/future/image";
import useHeatDivisionInfo from "../hooks/cc/useHeatDivisionInfo";
import Chrono from "../components/bigscreen/Chrono";
import { useTheme } from "@mui/styles";
import { Stack } from "@mui/system";
import DefaultLayout from "../components/overlay/DefaultLayout";
import DefaultMultiCategoriesLayout from "../components/overlay/DefaultMultiCategoriesLayout";
import SplitMTLayout from "../components/overlay/SplitMTLayout";
import SplitMTMultiCategoriesLayout from "../components/overlay/SplitMTMultiCategoriesLayout";

interface Props {
    parent: React.RefCallback<Element>;
    timer: string | number | null;
    plainTimer: number;
    fullStations: DisplayFullStation[];
    workout: Workout;
    workouts: Workout[];
    state: number;
    competition?: Competition;
    categories: string[];
}

const Overlay: React.FC<Props> = ({
    plainTimer,
    fullStations,
    workouts,
    workout,
    competition,
    categories,
}) => {
    const { heatName, workoutName } = useHeatDivisionInfo();
    const theme = useTheme() as Theme;

    const getLayoutComponent = (layoutName?: string) => {
        switch (layoutName) {
            // case "MaxTonnage":
            //     return (
            //         <MaxTonnage
            //             heatId={globals?.externalHeatId}
            //             stations={fullStations}
            //         />
            //     );
            // case "default2ScoresLayout":
            //     return (
            //         <Default2ScoresLayout
            //             workouts={workouts}
            //             stations={fullStations}
            //         />
            //     );
            case "splitMTMultiCategories":
                return (
                    <SplitMTMultiCategoriesLayout
                        workouts={workouts}
                        stations={fullStations}
                        timer={plainTimer}
                        categories={categories}
                    />
                );

            case "splitMT":
                return (
                    <SplitMTLayout
                        workout={workout}
                        stations={fullStations}
                        timer={plainTimer}
                    />
                );
            case "defaultMultiCategories":
                return (
                    <DefaultMultiCategoriesLayout
                        workouts={workouts}
                        stations={fullStations}
                        categories={categories}
                    />
                );

            default:
                return (
                    <DefaultLayout workout={workout} stations={fullStations} />
                );
        }
    };

    const logoUrl = useMemo(
        () =>
            workout?.options?.logo
                ? `/api/images/${competition?.logoUrl}`
                : "/api/images/tako.png",
        [workout?.options?.logo]
    );

    return (
        <Stack
            p={4}
            maxWidth={1920}
            minWidth={1920}
            maxHeight={1080}
            minHeight={1080}
            position={"relative"}
            overflow={"hidden"}
            justifyContent={"space-between"}
        >
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"start"}
            >
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    sx={{
                        background: `linear-gradient(270deg, ${theme.palette.primary.main} 0%,  ${theme.palette.secondary.main} 100%)`,
                    }}
                    height={60}
                    px={2}
                    borderRadius={1}
                >
                    {/*<Box*/}
                    {/*    overflow={"hidden"}*/}
                    {/*    height={100}*/}
                    {/*    width={100}*/}
                    {/*    borderRadius={"50%"}*/}
                    {/*    display={"flex"}*/}
                    {/*    alignItems={"center"}*/}
                    {/*    justifyContent={"center"}*/}
                    {/*    sx={{ dropShadow: "0px 0px 10px black" }}*/}
                    {/*    // sx={{ backgroundColor: "#000000aa" }}*/}
                    {/*>*/}
                    <Image
                        src={logoUrl}
                        width={110}
                        style={{
                            filter: `drop-shadow(0px 0px 4px black)`,
                        }}
                    />
                    <Box px={2}>
                        <Typography
                            lineHeight={1}
                            variant={"h5"}
                            color={"white"}
                            fontFamily={"BebasNeue"}
                            fontSize={"1.6rem"}
                        >
                            {workoutName}
                        </Typography>
                        <Typography
                            lineHeight={1}
                            variant={"h5"}
                            color={"white"}
                            fontFamily={"BebasNeue"}
                            fontSize={"1.6rem"}
                        >
                            {heatName}
                            {/*({divisions.join("/")})*/}
                        </Typography>
                    </Box>
                    {/*</Box>*/}
                </Box>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    gap={2}
                    sx={{
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%,  ${theme.palette.secondary.main} 100%)`,
                    }}
                    py={1}
                    px={2}
                    borderRadius={1}
                >
                    <Typography
                        fontSize={"1.4rem"}
                        fontFamily={"BebasNeue"}
                        color={"white"}
                    >
                        Time cap {workout?.duration} mins
                    </Typography>
                    <Box
                        my={-2}
                        sx={{ backgroundColor: "white" }}
                        px={2}
                        fontWeight={"bold"}
                    >
                        <Chrono
                            reverse={
                                workout?.options?.chronoDirection === "desc"
                            }
                            fontSize={"1.4rem"}
                            fontFamily={"ChivoMono"}
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"start"}
                gap={2}
                // justifySelf={"stretch"}
            >
                {getLayoutComponent(workout?.layout)}
            </Box>
        </Stack>
    );
};

export default withDisplayData(Overlay);
