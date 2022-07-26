import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";

const STATE_COLOR_GRID = {
    Q: "green",
    D: "pink",
    W: "orange",
    E: "red",
    R: "black",
};

const sortTournament = (a: { result: string }, b: { result: string }) => {
    if (a.result.includes(":") && !b.result.includes(":")) return -1;
    if (b.result.includes(":") && !a.result.includes(":")) return 1;
    if (!a.result.includes(":") && !b.result.includes(":"))
        return Number(b.result) - Number(a.result);
    return (
        Number(a.result.replace(":", "")) - Number(b.result.replace(":", ""))
    );
};

const RankedTournament = ({ tournament }: { tournament: Tournament }) => {
    const ranking = useMemo(() => {
        let ranking: any = {};
        const roundsWithRanking = tournament.rounds.filter(
            (r) => !!r.ranking?.start
        );

        roundsWithRanking.forEach((r) => {
            const results = r.heats.flatMap((h) => h.results);
            results.sort(sortTournament);
            for (let i = 0; i <= r.ranking.end - r.ranking.start; i++) {
                if (results[results.length - i - 1].state === "E") {
                    ranking[results[results.length - i - 1].participant.name] =
                        r.ranking.end - i;
                }
            }
        });

        return ranking;
    }, [tournament]);

    return (
        <TableContainer sx={{ width: "300px" }}>
            <Table size="small" aria-label="a dense table">
                {Object.entries(ranking)
                    .sort((a: any, b: any) => a[1] - b[1])
                    .map(([k, v]) => (
                        <TableRow key={`${k}`}>
                            <TableCell>{v}</TableCell>
                            <TableCell>{k}</TableCell>
                            {/* <li>{`${k}: ${v}`}</li> */}
                        </TableRow>
                    ))}
            </Table>
        </TableContainer>
    );
};

export default RankedTournament;
