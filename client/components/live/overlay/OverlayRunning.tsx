import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import OverlayRunningAthlete from "./OverlayRunningAthlete";
import OverlayRunningDuelAthlete from "./OverlayRunningDuelAthlete";
import useChrono from "../../../hooks/useChrono";
import { Typography } from "@mui/material";
import OverlayRunningDuelAthlete2 from "./OverlayRunningDuelAthlete2";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationPayload from "../../../hooks/useStationPayload";
import HeaderMT from "../../mt/HeaderMT";
import mtLogo from "../../../public/img/logo.png";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

const OverlayRunning = ({ version }: { version?: OverlayVersion }) => {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);

    const stationsUpgraded = useStationPayload(stations, ranks);
    const CCData = useCompetitionCornerContext();

    return (
        <Box
            className="displayZone"
            overflow={"hidden"}
            sx={{
                width: 1920,
                height: 1080,
                flexDirection: "column",
                justifyContent: "space-evenly",

                // border: "3px solid",
                // borderColor: "red",
            }}
        >
            <HeaderMT
                // logo={mtLogo}
                chrono={chrono?.toString().slice(0, 5) || ""}
                chronoFontSize="4rem"
                textTop={[
                    ...new Set(
                        stationsUpgraded?.map((station) => station.category)
                    ),
                ].join(" / ")}
                // textTop={CCData?.epHeat?.[0].heatName}
                textTopFontSize="4rem"
                imageWidth={"110px"}
                backgroundColor="black"
            />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                height="100%"
            >
                <Stack
                    direction="column"
                    alignItems="flex-start"
                    spacing={5.7}
                    paddingTop={1}
                    height="100%"
                >
                    {stationsUpgraded
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .slice(
                            0,
                            stationsUpgraded.length / 2 +
                                (stationsUpgraded.length % 2)
                        )
                        .map((s) => {
                            switch (version) {
                                case "duel":
                                    return (
                                        <OverlayRunningDuelAthlete
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="left"
                                            opposantData={stationsUpgraded[1]}
                                        />
                                    );
                                case "duel-2":
                                    return (
                                        <OverlayRunningDuelAthlete2
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="left"
                                            opposantData={stationsUpgraded[1]}
                                        />
                                    );
                                default:
                                    return (
                                        <OverlayRunningAthlete
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="left"
                                        />
                                    );
                            }
                        })}
                </Stack>
                <Stack
                    direction="column"
                    alignItems="flex-end"
                    spacing={5.7}
                    paddingTop={1}
                    height="100%"
                >
                    {stationsUpgraded
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .slice(
                            stationsUpgraded.length / 2 +
                                (stationsUpgraded.length % 2)
                        )
                        .map((s) => {
                            switch (version) {
                                case "duel":
                                    return (
                                        <OverlayRunningDuelAthlete
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="right"
                                            opposantData={stationsUpgraded[0]}
                                        />
                                    );
                                case "duel-2":
                                    return (
                                        <OverlayRunningDuelAthlete2
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="right"
                                            opposantData={stationsUpgraded[0]}
                                        />
                                    );
                                default:
                                    return (
                                        <OverlayRunningAthlete
                                            key={s.laneNumber}
                                            data={s}
                                            workout={getWorkout(
                                                loadedWorkouts,
                                                s
                                            )}
                                            position="right"
                                        />
                                    );
                            }
                        })}
                </Stack>
            </Stack>
        </Box>
    );
};

export default OverlayRunning;
