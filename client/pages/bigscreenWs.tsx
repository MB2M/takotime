import { Box, Typography } from "@mui/material";
import BigscreenLayout from "../components/bigscreen/BigscreenLayout";
import MaxTonnage from "../components/bigscreen/MaxTonnage";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";
import { useRouter } from "next/router";
import DefaultLayout from "../components/bigscreen/Layouts/default/DefaultLayout";
import useStationWs from "../hooks/bigscreen/useStationWs";
import Default2ScoresLayout from "../components/bigscreen/Layouts/default/Default2ScoresLayout";
import SplitMTLayout from "../components/bigscreen/Layouts/split/SplitMTLayout";

const HEADER_HEIGHT = 100;

const BigScreen = () => {
    // const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const { timer, plainTimer } = useChrono(
        globals?.startTime,
        globals?.duration
    );

    const { fullStations, workout, workouts } = useStationWs();

    const router = useRouter();
    const title = router.query.title as string | undefined;

    if (!workout) return <div>No workout loaded</div>;

    const getLayoutComponent = (layoutName?: string) => {
        switch (layoutName) {
            case "MaxTonnage":
                return (
                    <MaxTonnage
                        heatId={globals?.externalHeatId}
                        stations={fullStations}
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

            default:
                return (
                    <DefaultLayout workout={workout} stations={fullStations} />
                );
        }
    };

    return (
        <>
            <BigscreenLayout headerHeight={HEADER_HEIGHT} customTitle={title}>
                {/*<Stack overflow={"hidden"} height={1}>*/}
                {getLayoutComponent(workout?.layout)}
                {/*</Stack>*/}
            </BigscreenLayout>
            {globals?.state === 1 && (
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

export default BigScreen;
