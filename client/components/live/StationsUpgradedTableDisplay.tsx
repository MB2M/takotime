import { List, ListItem, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactChild, ReactFragment, ReactPortal } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useStationPayload from "../../hooks/useStationPayload";
import Header from "../mt/Header";
import mtLogo from "../../public/img/logo.png";
import useChrono from "../../hooks/useChrono";

const StationsUpgradedTableDisplay = ({
    sortBy,
}: {
    sortBy: "laneNumber" | "rank";
}) => {
    const { stations, ranks } = useLiveDataContext();

    const stationsUpgraded = useStationPayload(stations, ranks);

    return (
        <Stack direction={"row"} justifyContent="space-around" mt={5}>
            {stationsUpgraded
                .sort((a, b) => {
                    return sortBy === "rank"
                        ? a.rank[a.rank.length - 1] - b.rank[b.rank.length - 1]
                        : a.laneNumber - b.laneNumber;
                })
                .reduce(
                    (p: any, c: any, index: number, array: any[]) => {
                        if (index < array.length / 2) {
                            p[0].push(c);
                        } else {
                            p[1].push(c);
                        }
                        return p;
                    },
                    [[], []]
                )
                .map((l: any[], indexList: number) => (
                    <List
                        key={indexList}
                        sx={{
                            width: "45%",
                        }}
                    >
                        {l.map(
                            (s: {
                                laneNumber: number;
                                participant: string;
                                rank: (
                                    | boolean
                                    | ReactChild
                                    | ReactFragment
                                    | ReactPortal
                                    | null
                                    | undefined
                                )[];
                                result: string | any[];
                            }) => (
                                <>
                                    <ListItem
                                        key={s.laneNumber}
                                        sx={{
                                            border: "2px solid white",
                                        }}
                                    >
                                        <Box
                                            display={"flex"}
                                            justifyContent={"flex-end"}
                                            width={"100%"}
                                            color="white"
                                        >
                                            <Typography
                                                variant="h3"
                                                fontFamily={"CantoraOne"}
                                            >
                                                {sortBy === "laneNumber" ?s.laneNumber : s.rank[s.rank.length - 1]}
                                            </Typography>
                                            <Typography
                                                variant="h3"
                                                fontFamily={"CantoraOne"}
                                                ml={"30px"}
                                            >
                                                {s.participant.toUpperCase()}
                                            </Typography>
                                            <Typography
                                                variant="h3"
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
                                </>
                            )
                        )}
                    </List>
                ))}
        </Stack>
    );
};

export default StationsUpgradedTableDisplay;
