import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import useHeatDivisionInfo from "../../hooks/cc/useHeatDivisionInfo";
import { useCompetitionContext } from "../../context/competition";
import Logo from "../../components/bigscreen/Logo";
import useStationWs from "../../hooks/bigscreen/useStationWs";

const HeatResult = () => {
    const competition = useCompetitionContext();
    const { fullStations, results } = useStationWs();

    const { heatName, divisions } = useHeatDivisionInfo();

    if (!fullStations) return null;

    const middleIndex = Math.ceil(fullStations.length / 2);

    const stationWithResults = fullStations
        .map((station) => ({
            ...station,
            results: results.map((result) => ({
                workoutId: result.workoutId,
                score: result.results.find(
                    (r) => r.participantId === station.externalId
                ),
            })),
        }))
        .sort((a, b) => {
            return (
                (a.results.at(-1)?.score?.rank || 0) -
                (b.results.at(-1)?.score?.rank || 0)
            );
        })
        .sort((a, b) => (a.category < b.category ? 1 : -1));

    const firstHalf = stationWithResults.slice().splice(0, middleIndex);

    const secondHalf = stationWithResults.slice().splice(-middleIndex);

    const categories = [...new Set(fullStations.map((s) => s.category))];

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
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems="center"
                        gap={2}
                    >
                        {part.map((station) => (
                            <Box
                                key={station.laneNumber}
                                // maxWidth={1250}
                                width={1}
                                borderRadius={4}
                                border={`2px solid ${
                                    categories.indexOf(station.category)
                                        ? competition?.primaryColor
                                        : competition?.secondaryColor
                                }`}
                                display={"flex"}
                                gap={3}
                                overflow={"hidden"}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: categories.indexOf(
                                            station.category
                                        )
                                            ? competition?.primaryColor
                                            : competition?.secondaryColor,
                                    }}
                                    py={0.5}
                                    display={"flex"}
                                    justifyContent={"center"}
                                >
                                    <Typography
                                        sx={{ color: "black" }}
                                        fontSize={"3.2rem"}
                                        fontFamily={"BebasNeue"}
                                        my={"auto"}
                                        px={1}
                                        width={45}
                                        textAlign={"center"}
                                    >
                                        {station.results.at(-1)?.score?.rank}
                                    </Typography>
                                </Box>
                                <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"center"}
                                    alignItems={"start"}
                                    width={1}
                                    pt={1.8}
                                >
                                    <Typography
                                        fontFamily={"BebasNeue"}
                                        sx={{ color: "white" }}
                                        fontSize={"3.2rem"}
                                        lineHeight={"2rem"}
                                    >
                                        {station.participant}
                                    </Typography>
                                    <Box
                                        width={1}
                                        display={"flex"}
                                        gap={2}
                                        justifyContent={"space-evenly"}
                                    >
                                        {station.results.map(
                                            (result, _, array) => (
                                                <Box
                                                    display={"flex"}
                                                    gap={2}
                                                    alignItems={"baseline"}
                                                >
                                                    <Typography
                                                        fontFamily={
                                                            competition?.customFont
                                                        }
                                                        color={
                                                            competition?.secondaryColor
                                                        }
                                                        fontSize={"3.2rem"}
                                                        lineHeight={"1.5rem"}
                                                    >
                                                        {
                                                            result.score
                                                                ?.finalScore
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        fontFamily={
                                                            competition?.customFont
                                                        }
                                                        color={
                                                            competition?.secondaryColor
                                                        }
                                                        fontSize={"1.7rem"}
                                                        lineHeight={"1.5rem"}
                                                    >
                                                        {
                                                            !result.score
                                                                ?.finished
                                                        }
                                                        {result.score?.units}
                                                    </Typography>
                                                    {array.length > 1 && (
                                                        <Typography
                                                            fontFamily={
                                                                competition?.customFont
                                                            }
                                                            color={
                                                                competition?.primaryColor
                                                            }
                                                            fontSize={"2.8rem"}
                                                            lineHeight={"4rem"}
                                                        >
                                                            (
                                                            {result.score?.rank}
                                                            )
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HeatResult;
