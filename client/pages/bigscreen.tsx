import { Box, Typography } from "@mui/material";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import DefaultLayout from "../components/bigscreen/Layouts/default/DefaultLayout";
import withDisplayData from "../utils/withDisplayData";
import React from "react";
import DefaultMultiCategoriesLayout from "../components/bigscreen/Layouts/default/DefaultMultiCategoriesLayout";
import SplitMTMultiCategoriesLayout from "../components/bigscreen/Layouts/split/SplitMTMultiCategoriesLayout";
import SplitLayout from "../components/bigscreen/Layouts/split/SplitLayout";
import { useCompetitionContext } from "../context/competition";

const HEADER_HEIGHT = 100;

interface Props {
    parent: React.RefCallback<Element>;
    timer: string | number | null;
    plainTimer: number;
    fullStations: DisplayFullStation[];
    activeWorkouts: Workout[];
    workouts: Workout[];
    state: number;
    competition?: Competition;
    categories: string[];
    CCResults: CCSimpleResult[];
    results: WodResult[];
}

const BigScreen: React.FC<Props> = ({
    timer,
    plainTimer,
    fullStations,
    workouts,
    activeWorkouts,
    state,
    categories,
    CCResults,
    results,
}) => {
    const competition = useCompetitionContext();
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

            case "split":
                return (
                    <SplitLayout
                        activeWorkouts={activeWorkouts}
                        stations={fullStations}
                        timer={plainTimer}
                        CCResults={CCResults}
                        results={results}
                        categories={categories}
                        workouts={workouts}
                    />
                );

            // case "splitMT":
            //     return (
            //         <SplitMTLayout
            //             workout={activeWorkouts}
            //             stations={fullStations}
            //             timer={plainTimer}
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

            default:
                return (
                    <DefaultLayout
                        activeWorkouts={activeWorkouts}
                        stations={fullStations}
                        CCResults={CCResults}
                        results={results}
                        categories={categories}
                        workouts={workouts}
                    />
                );
        }
    };

    if (!activeWorkouts) return <div>No workout loaded</div>;

    return (
        <>
            <BigscreenLayout
                headerHeight={HEADER_HEIGHT}
                customTitle={""}
                workout={activeWorkouts[0]}
            >
                {getLayoutComponent(activeWorkouts[0]?.layout)}
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
                        color={competition?.secondaryColor}
                        sx={{
                            textShadow: `10px 10px 5px ${competition?.primaryColor}`,
                        }}
                        fontSize={"45rem"}
                        fontFamily={competition?.customFont || "bebasNeue"}
                    >
                        {timer?.toString().slice(1) || ""}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default withDisplayData(BigScreen);
