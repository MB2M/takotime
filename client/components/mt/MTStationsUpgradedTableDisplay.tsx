import { List, ListItem, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactChild, ReactFragment, ReactPortal } from "react";


const MTStationsUpgradedTableDisplay = ({
    sortBy,
    stations,
}: {
    sortBy: "laneNumber" | "rank";
    stations: any;
}) => {

    return (
        <Stack direction={"row"} justifyContent="space-around" mt={5}>
            {stations
                .sort((a:any, b:any) => {
                    return sortBy === "rank"
                        ? a.rank - b.rank
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
                                result: number;
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
                                                {sortBy === "laneNumber"
                                                    ? s.laneNumber
                                                    : s.rank}
                                            </Typography>
                                            <Typography
                                                variant="h3"
                                                fontFamily={"CantoraOne"}
                                                ml={"30px"}
                                                maxWidth="520px"
                                                noWrap
                                            >
                                                {s.participant.toUpperCase()}
                                            </Typography>
                                            <Typography
                                                variant="h3"
                                                fontFamily={"CantoraOne"}
                                                ml="auto"
                                            >
                                                {s.result}
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

export default MTStationsUpgradedTableDisplay;
