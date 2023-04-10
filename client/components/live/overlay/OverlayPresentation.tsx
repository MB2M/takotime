import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import useChrono from "../../../hooks/useChrono";
import { List, ListItem, Typography } from "@mui/material";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationPayload from "../../../hooks/useStationPayload";
import HeaderMT from "../../mt/HeaderMT";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";

const OverlayResult = () => {
    const { globals, stations, ranks } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);

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
            }}
        >
            <HeaderMT
                // logo={mtLogo}
                chrono={timer?.toString().slice(0, 5) || ""}
                chronoFontSize="4rem"
                textTop={[
                    ...new Set(
                        stationsUpgraded?.map((station) => station.category)
                    ),
                ].join(" / ")}
                // textTop={CCData?.epHeat?.[0].heatName}
                textTopFontSize="4rem"
                imageWidth={"110px"}
                backgroundColor="#000000fa"
            />
            <Stack
                direction="column"
                // justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                width="25%"
                height="100%"
                sx={{ backgroundColor: "#000000fa" }}
                color={"white"}
            >
                <Typography
                    variant="h5"
                    fontFamily={"CantoraOne"}
                    textAlign="center"
                >
                    Heat Recap
                </Typography>
                <List sx={{ width: "100%" }}>
                    {stationsUpgraded
                        ?.sort((a: any, b: any) => a.laneNumber - b.laneNumber)
                        .map((s) => {
                            const CCEP = CCData?.epHeat?.find(
                                (ep) => ep.station === s.laneNumber
                            );
                            return (
                                <ListItem
                                    key={s.laneNumber}
                                    sx={{
                                        borderBottom: "2px solid white",
                                        borderTop: "2px solid white",
                                    }}
                                >
                                    <Box
                                        display={"flex"}
                                        justifyContent={"flex-end"}
                                        width={"100%"}
                                        color={
                                            CCEP?.rank === "1"
                                                ? "#FFD600"
                                                : CCEP?.rank === "2"
                                                ? "#05c1de"
                                                : CCEP?.rank === "3"
                                                ? "#fd1085"
                                                : "white"
                                        }
                                    >
                                        <Typography
                                            variant="h5"
                                            fontFamily={"CantoraOne"}
                                        >
                                            {s.laneNumber}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontFamily={"CantoraOne"}
                                            ml={"15px"}
                                            mr="auto"
                                            noWrap
                                            maxWidth={"250px"}
                                        >
                                            {s.participant.toUpperCase()}
                                        </Typography>
                                        <Box display="flex">
                                            <Typography
                                                variant="h5"
                                                fontFamily={"CantoraOne"}
                                                mr="30px"
                                            >
                                                {CCEP?.points
                                                    ? CCEP?.points + " pts"
                                                    : CCEP?.points}
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                fontFamily={"CantoraOne"}
                                                width="20px"
                                                textAlign={"end"}
                                            >
                                                {CCEP?.rank}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })}
                </List>
            </Stack>
        </Box>
    );
};

export default OverlayResult;
