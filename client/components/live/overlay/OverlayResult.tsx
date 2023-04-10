import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import useChrono from "../../../hooks/useChrono";
import { List, ListItem, Typography } from "@mui/material";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationPayload from "../../../hooks/useStationPayload";
import HeaderMT from "../../mt/HeaderMT";

const OverlayResult = () => {
    const { globals, stations, ranks } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);

    const stationsUpgraded = useStationPayload(stations, ranks);
    // const CCData = useCompetitionCornerContext();

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
                        ?.sort(
                            (a, b) =>
                                a.rank[a.rank.length - 1] -
                                b.rank[b.rank.length - 1]
                        )
                        .map((s) => (
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
                                    color="white"
                                >
                                    <Typography
                                        variant="h5"
                                        fontFamily={"CantoraOne"}
                                    >
                                        {s.rank[s.rank.length - 1]}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontFamily={"CantoraOne"}
                                        ml={"15px"}
                                    >
                                        {s.participant.toUpperCase()}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontFamily={"CantoraOne"}
                                        ml="auto"
                                    >
                                        {s.result?.slice(
                                            0,
                                            s.result.length - 1
                                        )}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                </List>
            </Stack>
        </Box>
    );
};

export default OverlayResult;
