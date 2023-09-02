import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useHeatDivisionInfo from "../../hooks/cc/useHeatDivisionInfo";
import { useCompetitionContext } from "../../context/competition";
import Logo from "../../components/bigscreen/Logo";

const HeatSummary = () => {
    const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const [stations, setStations] = useState<
        {
            station: number;
            affiliate: string;
            competitor: string;
            countryCode: string;
        }[]
    >();

    const { heatName, divisions } = useHeatDivisionInfo();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `/api/cc/getResults?eventId=${globals?.externalEventId}&workoutId=${globals?.externalWorkoutId}&heatId=${globals?.externalHeatId}`
                );

                if (response.ok) {
                    const json = await response.json();
                    setStations(json);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    if (!stations) return null;

    const middleIndex = Math.ceil(stations.length / 2);
    stations.sort((a, b) => a.station - b.station);

    const firstHalf = stations.slice().splice(0, middleIndex);

    const secondHalf = stations.slice().splice(-middleIndex);

    return (
        <Box
            minHeight="100vh"
            display={"flex"}
            flexDirection={"column"}
            sx={{
                backgroundColor: "#101010",
                color: "white",
            }}
        >
            <Box
                display={"flex"}
                py={5}
                alignItems={"center"}
                height={250}
                justifyContent={"center"}
                gap={10}
            >
                <Logo
                    logo={`/api/images/${competition?.logoUrl}`}
                    logoWidth="160px"
                />
                <Stack>
                    <Typography
                        fontSize={"4.5rem"}
                        fontFamily={competition?.customFont}
                        color={competition?.primaryColor}
                        lineHeight={"3rem"}
                    >
                        {heatName}
                    </Typography>
                    <Typography
                        fontSize={"3rem"}
                        fontFamily={competition?.customFont}
                        color={competition?.secondaryColor}
                    >
                        {divisions.join("/")}
                    </Typography>
                </Stack>
            </Box>
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={5}
            >
                {[firstHalf, secondHalf].map((part, index) => (
                    <Box
                        width={0.46}
                        key={index}
                        // px={2}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems="center"
                        gap={2.5}
                    >
                        {part
                            ?.sort((a, b) => a.station - b.station)
                            .map((station) => (
                                <Box
                                    key={station.station}
                                    maxWidth={1250}
                                    width={1}
                                    borderRadius={4}
                                    border={`2px solid ${competition?.secondaryColor}`}
                                    display={"flex"}
                                    gap={3}
                                    overflow={"hidden"}
                                    // py={0.5}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor:
                                                competition?.secondaryColor,
                                        }}
                                        py={0.5}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        // borderRadius={"0 0 5px 0"}
                                    >
                                        <Typography
                                            sx={{ color: "black" }}
                                            fontSize={"3.2rem"}
                                            fontFamily={"BebasNeue"}
                                            my={"auto"}
                                            px={1}
                                            width={55}
                                            textAlign={"center"}
                                        >
                                            {station.station}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        justifyContent={"center"}
                                        alignItems={"start"}
                                    >
                                        <Typography
                                            fontFamily={"BebasNeue"}
                                            sx={{ color: "white" }}
                                            fontSize={"3.2rem"}
                                            lineHeight={"2rem"}
                                            pt={2}
                                        >
                                            {station.competitor}
                                            {/*{getFlagEmoji(station.countryCode)}*/}
                                        </Typography>
                                        <Typography
                                            fontFamily={competition?.customFont}
                                            color={competition?.primaryColor}
                                            fontSize={"2.8rem"}
                                            // color={"gray"}
                                            // ml={"auto"}
                                        >
                                            {station.affiliate}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HeatSummary;
