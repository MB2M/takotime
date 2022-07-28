import { TableContainer, Table, TableRow, TableCell } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";

const STATE_COLOR_GRID = {
    Q: "lightgreen",
    D: "pink",
    DQ: "lightblue",
    W: "orange",
    E: "#ff8181",
    R: "lightgray",
};

const RankedRound = ({
    heats,
    byPoints = false,
}: {
    heats: Heat[];
    byPoints: boolean;
}) => {
    const sortedHeat = useMemo(() => {
        let results = heats.flatMap((h) => h.results);
        if (byPoints) {
            results = [...new Set(results.map((r) => r.participant.name))].map(
                (p) => {
                    const pointsSum = results
                        .filter((r) => r.participant.name === p)
                        .reduce((p, c) => p + (c.points || 0), 0);
                    return {
                        participant: results.find(
                            (r) => r.participant.name === p
                        )?.participant || { customId: "", name: "" },
                        station:
                            results.find((r) => r.participant.name === p)
                                ?.station || 1,
                        result: pointsSum.toString(),
                        state: "D",
                    };
                }
            );
        }
        const newResults = results.sort((a, b) => {
            if (a.result.includes(":") && !b.result.includes(":")) return -1;
            if (b.result.includes(":") && !a.result.includes(":")) return 1;
            if (!a.result.includes(":") && !b.result.includes(":"))
                return Number(b.result) - Number(a.result);
            return (
                Number(a.result.replace(":", "")) -
                Number(b.result.replace(":", ""))
            );
        });

        return { results: newResults };
    }, [heats]);
    return (
        <TableContainer>
            <Table size="small" aria-label="a dense table">
                {sortedHeat.results?.map((r, i) => (
                    <TableRow
                        key={`${r._id}-${r.station}-${r.participant.name}`}
                        sx={{ backgroundColor: STATE_COLOR_GRID[r.state] }}
                    >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{r.participant?.name}</TableCell>
                        <TableCell>{r.result}</TableCell>
                        <TableCell>{r.state}</TableCell>
                    </TableRow>
                    // <Box
                    //     key={}
                    //     sx={{ color: STATE_COLOR_GRID[r.state] }}
                    // >
                    //     <li>{`${r.participant?.name} - ${r.result} - state: ${r.state}`}</li>
                    // </Box>
                ))}
            </Table>
        </TableContainer>
    );
};

export default RankedRound;
