import {
    Divider,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";
import { useLiveDataContext } from "../context/liveData/livedata";

const Speaker = () => {
    const { globals } = useLiveDataContext();
    const EPInfo = useCompetitionCornerContext();
    const [stations, setStations] = useState<any>();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `https://competitioncorner.net/api2/v1/schedule/workout/${globals?.externalWorkoutId}`
                );
                if (response.ok) {
                    const json = await response.json();
                    const stations = json.find(
                        (heat: { id: number | undefined }) =>
                            heat.id === globals?.externalHeatId
                    )?.stations;
                    if (stations) {
                        setStations(stations);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    console.log(stations);

    return (
        <Box
            height="100vh"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-evenly"}
            sx={{ backgroundColor: "#262626", color: "white" }}
        >
            <Box display={"flex"} justifyContent={"space-around"} py={2}>
                <Typography variant="h4">
                    {EPInfo?.epHeat?.[0].heatName} (
                    {EPInfo?.epHeat?.[0].division})
                </Typography>
                <Typography variant="h5">
                    {EPInfo?.epHeat?.[0].heatTime}
                </Typography>
            </Box>
            <TableContainer>
                <Table sx={{ p: 0 }} size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>#</TableCell>
                            <TableCell sx={{ color: "white" }}>
                                Participant
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>Box</TableCell>
                            <TableCell sx={{ color: "white" }}>Rank</TableCell>
                            <TableCell sx={{ color: "white" }}>
                                Points
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EPInfo.epHeat
                            ?.sort((a, b) => a.station - b.station)
                            .map((ep) => (
                                <TableRow>
                                    <TableCell sx={{ color: "white" }}>
                                        {ep.station}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        {ep.displayName}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        {stations?.find(
                                            (station: { station: number }) =>
                                                station.station === ep.station
                                        ).affiliate || ""}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        {ep.rank}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        {ep.points}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Speaker;
