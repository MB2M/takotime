import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import { List, ListItem, Typography } from "@mui/material";
import { Key, ReactChild, ReactFragment, ReactPortal } from "react";
import Header from "./Header";
import { useCompetitionCornerContext } from "../../context/competitionCorner/data/competitionCorner";

const MTOverlayResult = ({ stations }: { stations: any }) => {
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
            <Header
                // logo={mtLogo}
                chronoFontSize="4rem"
                textTop={CCData?.epHeat?.[0].heatName}
                textTopFontSize="4rem"
                imageWidth={"110px"}
                backgroundColor="black"
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
                    {stations
                        ?.sort(
                            (a: { rank: number }, b: { rank: number }) =>
                                a.rank - b.rank
                        )
                        .map(
                            (s: {
                                laneNumber: Key | null | undefined;
                                rank:
                                    | boolean
                                    | ReactChild
                                    | ReactFragment
                                    | ReactPortal
                                    | null
                                    | undefined;
                                participant: string;
                                result:
                                    | boolean
                                    | ReactChild
                                    | ReactFragment
                                    | ReactPortal
                                    | null
                                    | undefined;
                            }) => (
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
                                            {s.rank}
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
                                            {s.result}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            )
                        )}
                </List>
            </Stack>
        </Box>
    );
};

export default MTOverlayResult;
