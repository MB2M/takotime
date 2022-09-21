import { useEffect, useState } from "react";
import { useEventContext } from "../../../context/event";
import { usePlanning } from "../../../utils/mt/usePlanning";
import Clock from "react-live-clock";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Stack,
} from "@mui/material";
import { bg, logo } from "../../../eventConfig/mandelieu/config";
import useChrono from "../../../hooks/useChrono";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import Image from "next/image";

const WarmupCurrent = () => {
    const { globals } = useLiveDataContext();
    const planning = usePlanning(45000);
    const [allowedHeats, setAllowedHeats] = useState<PlanningHeat[]>([]);
    const liveData = useLiveDataContext();
    const chrono = useChrono(
        liveData.globals?.startTime,
        liveData.globals?.duration
    );

    useEffect(() => {
        if (planning && globals?.externalHeatId) {
            let allowedHeats = [];

            for (let i = 0; i < planning.length; i++) {
                let heat = planning[i];
                if (heat.id === globals.externalHeatId) {
                    allowedHeats.push(planning[i]);
                    if (i + 1 < planning.length) {
                        allowedHeats.push(planning[i + 1]);
                    }
                }
            }
            setAllowedHeats(allowedHeats);
        }
    }, [planning, globals?.externalHeatId]);

    return (
        <>
            <Box
                sx={{
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(${bg.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(8px)",
                    webkitFilter: "blur(8px)",
                }}
            ></Box>
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                position="absolute"
                sx={{
                    height: "100vh",
                    width: "100vw",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                {allowedHeats.length === 0 ? (
                    <Typography
                        variant={"h1"}
                        fontSize={"50rem"}
                        fontFamily={"CantoraOne"}
                    >
                        <Clock
                            format={"HH:mm"}
                            ticking={true}
                            timezone={"Europe/Paris"}
                        />
                    </Typography>
                ) : (
                    <>
                        <Box
                            width={250}
                            sx={{
                                position: "absolute",
                                top: "15px",
                                left: "15px",
                            }}
                        >
                            <Image src={logo} layout="responsive"></Image>
                        </Box>
                        <Typography
                            variant={"h1"}
                            fontSize={"7rem"}
                            fontFamily={"CantoraOne"}
                            sx={{ position: "absolute", top: 30, right: 30 }}
                        >
                            <Clock
                                format={"HH:mm"}
                                ticking={true}
                                timezone={"Europe/Paris"}
                            />
                        </Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            gap={20}
                            paddingX={5}
                        >
                            {allowedHeats.map((allowedHeat, index) => {
                                return (
                                    <Grid item xs={4}>
                                        <Paper
                                            sx={{
                                                backgroundColor: "#ffffff30",
                                            }}
                                        >
                                            <Typography
                                                fontSize={"3.5vmin"}
                                                textAlign={"center"}
                                                fontFamily={"CantoraOne"}
                                            >
                                                {`${
                                                    index
                                                        ? "Next Heat"
                                                        : "Current Heat"
                                                } :`}
                                            </Typography>
                                            <Typography
                                                fontSize={"5vmin"}
                                                textAlign={"center"}
                                                fontFamily={"CantoraOne"}
                                                marginBottom={3}
                                            >
                                                {`${allowedHeat.title}  ${
                                                    index
                                                        ? " @ " +
                                                          allowedHeat.time
                                                        : chrono
                                                        ? " : " +
                                                          chrono
                                                              ?.toLocaleString()
                                                              .slice(0, 5)
                                                        : ""
                                                }`}
                                            </Typography>
                                            <Table size="small">
                                                <TableBody>
                                                    {allowedHeat.stations.map(
                                                        (station) => (
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography
                                                                        textAlign={
                                                                            "center"
                                                                        }
                                                                        fontFamily={
                                                                            "CantoraOne"
                                                                        }
                                                                        fontSize={"3.8vmin"}
                                                                    >
                                                                        {
                                                                            station.station
                                                                        }
                                                                
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography
                                                                        variant="h5"
                                                                        fontSize={
                                                                            30
                                                                        }
                                                                        fontFamily={
                                                                            "CantoraOne"
                                                                        }
                                                                    >
                                                                        {station.participantName.toUpperCase()}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>
                )}
            </Box>
        </>
    );
};

export default WarmupCurrent;
