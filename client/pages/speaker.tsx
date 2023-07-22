import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLiveDataContext } from "../context/liveData/livedata";
import { getFlagEmoji } from "../utils/flagEmoji";
import useHeatDivisionInfo from "../hooks/cc/useHeatDivisionInfo";

const Speaker = () => {
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
                justifyContent={"space-around"}
                py={5}
                alignItems={"center"}
            >
                <Typography variant="h4">
                    {heatName} ({divisions.join("/")})
                </Typography>
            </Box>

            <Box
                px={2}
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                gap={1}
            >
                {stations
                    ?.sort((a, b) => a.station - b.station)
                    .map((station) => (
                        <Box
                            maxWidth={800}
                            width={0.95}
                            borderRadius={4}
                            border={"2px solid gray"}
                            display={"flex"}
                            gap={2}
                        >
                            <Typography
                                sx={{ color: "white" }}
                                fontSize={"2.5rem"}
                                fontFamily={"BebasNeue"}
                                my={"auto"}
                                px={1}
                                width={45}
                                textAlign={"end"}
                            >
                                {station.station}
                            </Typography>
                            <Box>
                                <Typography
                                    fontFamily={"BebasNeue"}
                                    sx={{ color: "white" }}
                                    fontSize={"1.5rem"}
                                >
                                    {getFlagEmoji(station.countryCode)}{" "}
                                    {station.competitor}
                                </Typography>
                                <Typography
                                    fontFamily={"BebasNeue"}
                                    fontSize={"1.2rem"}
                                    color={"gray"}
                                >
                                    {station.affiliate}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
};

export default Speaker;
