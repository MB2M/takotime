import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import HRunningAthlete from "./HRunningAthlete";
import useStationPayload from "../../../hooks/useStationPayload";
import HeatPresentation from "../HeatPresentation";
import Header from "../../mt/Header";
import mtLogo from "../../../public/img/logo.png";
import StationsUpgradedTableDisplay from "../StationsUpgradedTableDisplay";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";

function HorizontalRunningNoData() {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const stationsUpgraded = useStationPayload(stations, ranks);
    const [toggle, setToggle] = useState<"wod" | "participants">("wod");
    const CCData = useCompetitionCornerContext();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setToggle((toggle) => (toggle === "wod" ? "participants" : "wod"));
        }, 40000);

        return () => clearInterval(intervalId);
    }, []);

    if (globals?.state === 1) {
        return (
            <Box
                sx={{ width: 1920, height: 1080, backgroundColor: "#242424" }}
                overflow={"hidden"}
            >
                <Typography
                    color={"gray"}
                    fontSize={"45rem"}
                    fontFamily={"CantoraOne"}
                    textAlign="center"
                >
                    {chrono?.toString().slice(1) || ""}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            display={"flex"}
            gap={0}
            overflow={"hidden"}
            sx={{
                flexDirection: "column",
                width: 1920,
                height: 1080,
                backgroundColor: "#242424",
            }}
        >
            <Header
                logo={mtLogo}
                imageWidth={"300px"}
                textTop={[...new Set(stationsUpgraded?.map(station => station.category))].join(" / ")}
                textTopFontSize={"6rem"}
                chrono={chrono?.toString().slice(0, 5) || ""}
            />
            {(toggle === "participants" && (
                <StationsUpgradedTableDisplay sortBy={"laneNumber"} />
            )) ||
                (toggle === "wod" && (
                    <Box textAlign="center">
                        {loadedWorkouts?.[0]?.blocks.flatMap(
                            (block, index1) => {
                                let mvts: JSX.Element[][] = [];
                                for (let i = 0; i < block.rounds; i++) {
                                    mvts.push(
                                        block.movements.map(
                                            (movement, index2) => {
                                                const mvt = `${
                                                    movement.reps +
                                                    (movement.varEachRounds ||
                                                        0) *
                                                        i
                                                } ${movement.name}`;
                                                return (
                                                    <Typography
                                                        key={
                                                            index1 +
                                                            "-" +
                                                            index2
                                                        }
                                                        color={"gray"}
                                                        fontSize={"5.5rem"}
                                                        fontFamily={
                                                            "CantoraOne"
                                                        }
                                                    >
                                                        {mvt}
                                                    </Typography>
                                                );
                                            }
                                        )
                                    );
                                }
                                return mvts;
                            }
                        )}
                    </Box>
                ))}
        </Box>
    );
}

export default HorizontalRunningNoData;
