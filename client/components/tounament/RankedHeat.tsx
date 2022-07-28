import { Table, TableCell, TableContainer, TableRow } from "@mui/material";
import { useMemo } from "react";

const RankedHeat = ({ heat }: { heat: Heat }) => {
    const sortedHeat = useMemo(() => {
        const newResults = heat.results
            ?.map((r) => r)
            .sort((a, b) => {
                if (a.result.includes(":") && !b.result.includes(":"))
                    return -1;
                if (b.result.includes(":") && !a.result.includes(":")) return 1;
                if (!a.result.includes(":") && !b.result.includes(":"))
                    return Number(b.result) - Number(a.result);
                return (
                    Number(a.result.replace(":", "")) -
                    Number(b.result.replace(":", ""))
                );
            });

        return { results: newResults };
    }, [heat]);

    return (
        <div>
            <TableContainer >
                <Table size="small" aria-label="a dense table">
                    {sortedHeat.results?.map((r, i) => (
                        <TableRow key={r.station}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{r.participant.name}</TableCell>
                            <TableCell>{r.result}</TableCell>
                            {r.points && <TableCell>{r.points}</TableCell>}
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
        </div>
    );
};

export default RankedHeat;
