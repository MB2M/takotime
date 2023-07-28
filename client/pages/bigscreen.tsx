import { Box, Typography } from "@mui/material";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import DefaultLayout from "../components/bigscreen/Layouts/default/DefaultLayout";
import Default2ScoresLayout from "../components/bigscreen/Layouts/default/Default2ScoresLayout";
import SplitMTLayout from "../components/bigscreen/Layouts/split/SplitMTLayout";
import withDisplayData from "../utils/withDisplayData";
import React from "react";
import DefaultMultiCategoriesLayout from "../components/bigscreen/Layouts/default/DefaultMultiCategoriesLayout";
import SplitMTMultiCategoriesLayout from "../components/bigscreen/Layouts/split/SplitMTMultiCategoriesLayout";

const HEADER_HEIGHT = 100;

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

const BigScreen: React.FC<Props> = ({
    timer,
    plainTimer,
    fullStations,
    workouts,
    workout,
    state,
    categories,
}) => {
    //

    const getLayoutComponent = (layoutName?: string) => {
        switch (layoutName) {
            // case "MaxTonnage":
            //     return (
            //         <MaxTonnage
            //             heatId={globals?.externalHeatId}
            //             stations={fullStations}
            //         />
            //     );
            case "defaultMultiCategories":
                return (
                    <DefaultMultiCategoriesLayout
                        workouts={workouts}
                        stations={fullStations}
                        categories={categories}
                    />
                );

            case "default2ScoresLayout":
                return (
                    <Default2ScoresLayout
                        workouts={workouts}
                        stations={fullStations}
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

            case "splitMTMultiCategories":
                return (
                    <SplitMTMultiCategoriesLayout
                        workouts={workouts}
                        stations={fullStations}
                        timer={plainTimer}
                        categories={categories}
                    />
                );

            default:
                return (
                    <DefaultLayout workout={workout} stations={fullStations} />
                );
        }
    };

    if (!workout) return <div>No workout loaded</div>;

    return (
        <>
            <BigscreenLayout
                headerHeight={HEADER_HEIGHT}
                customTitle={""}
                workout={workout}
            >
                {getLayoutComponent(workout?.layout)}
            </BigscreenLayout>
            {state === 1 && !timer?.toString().includes(":") && (
                <Box
                    width={1920}
                    height={1080}
                    top={0}
                    position="absolute"
                    sx={{
                        backgroundColor: "#000000bb",
                        backdropFilter: "blur(6px)",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography
                        color={"white"}
                        fontSize={"45rem"}
                        fontFamily={"ChivoMono"}
                    >
                        {timer?.toString().slice(1) || ""}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default withDisplayData(BigScreen);
