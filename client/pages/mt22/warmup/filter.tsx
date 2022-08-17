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
} from "@mui/material";
import mtBackground from "../../../public/img/mtBackground.jpg";
import { useLiveDataContext } from "../../../context/liveData/livedata";

const Warmup = () => {
    const { globals } = useLiveDataContext();
    const planning = usePlanning(45000);
    const [allowedHeats, setAllowedHeats] = useState<PlanningHeat[]>([]);


    console.log(globals?.externalHeatId)

    useEffect(() => {
        if (planning && globals?.externalHeatId) {
            let allowedHeats = [];

            for (let i = 0; i < planning.length; i++) {
                let heat = planning[i];
                if (heat.id === globals.externalHeatId) {
                    if (i + 1 < planning.length) {
                        allowedHeats.push(planning[i + 1]);
                    }
                    if (i + 2 < planning.length) {
                        allowedHeats.push(planning[i + 2]);
                    }
                    if (i + 3 < planning.length) {
                        allowedHeats.push(planning[i + 3]);
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
                    backgroundImage: `url(${mtBackground.src})`,
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
                {allowedHeats.length === 0 && (
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
                )}

                {/* <Banner>
                <div>Warmup zone</div>
                <div className="display-1 strasua">Allowed heats :</div>
            </Banner> */}
                <Grid
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={5}
                    paddingX={5}
                >
                    {allowedHeats.map((allowedHeat, index) => {
                        return (
                            <Grid item xs={4}>
                                <Paper sx={{ backgroundColor: "#ffffff30" }}>
                                    <Typography
                                        variant="h4"
                                        textAlign={"center"}
                                        fontFamily={"CantoraOne"}
                                    >
                                        {`Next Heat ${
                                            index ? "+" + index : ""
                                        } :`}
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        textAlign={"center"}
                                        fontFamily={"CantoraOne"}
                                        marginBottom={5}
                                    >
                                        {`${allowedHeat.title} @ ${allowedHeat.time}`}
                                    </Typography>
                                    <Table size="small">
                                        <TableBody>
                                            {allowedHeat.stations.map(
                                                (station) => (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography
                                                                variant="h5"
                                                                textAlign={
                                                                    "center"
                                                                }
                                                                fontFamily={
                                                                    "CantoraOne"
                                                                }
                                                                fontSize={30}
                                                                // fontWeight={600}
                                                            >
                                                                {
                                                                    station.station
                                                                }
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                variant="h5"
                                                                // textAlign={"center"}
                                                                fontSize={30}
                                                                fontFamily={
                                                                    "CantoraOne"
                                                                }
                                                            >
                                                                {
                                                                    station.participantName
                                                                }
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>

                            // <div className="col-4">
                            //     <div className="card bg-transparent strasua">
                            //         <div className="card-body">
                            //             <div className="card-title text-center h4 strasua">
                            //                 {h.title}
                            //             </div>
                            //             <ul className="list-group list-group-flush">
                            //                 {h.stations.map((s) => (
                            //                     <li className="list-group-item bg-transparent text-white d-flex">
                            //                         <div className="warmup-filter-lane">
                            //                             {s.station}
                            //                         </div>
                            //                         <div className="default-font">
                            //                             {s.participantName}
                            //                         </div>
                            //                     </li>
                            //                 ))}
                            //             </ul>
                            //         </div>
                            //     </div>
                            // </div>
                        );
                    })}
                </Grid>
            </Box>
        </>
    );
};

export default Warmup;
