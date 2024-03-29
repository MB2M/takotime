import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
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
            <TableContainer>
                <Table size="small" aria-label="a dense table">
                    <TableBody>
                        {sortedHeat.results?.map((r, i, array) => (
                            <TableRow key={r.station}>
                                <TableCell>{1 +
                                    array.findIndex(
                                        (result) =>
                                            Number(result.result.replace(":", "")) ===
                                            Number(r.result.replace(":", ""))
                                    )}</TableCell>
                                <TableCell>{r.participant.name}</TableCell>
                                <TableCell>{r.result}</TableCell>
                                {r.points && <TableCell>{r.points}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RankedHeat;
