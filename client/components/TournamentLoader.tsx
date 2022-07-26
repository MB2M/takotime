import { Button, MenuItem, OutlinedInput, Select } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";

const TournamentLoader = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] =
        useState<string>("");
    const [selectedRoundId, setSelectedRoundId] = useState<string>("");
    const [selectedHeatId, setSelectedHeatId] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const tournaments: Tournament[] = await response.json();
                setTournaments(tournaments);
            } catch (err) {
                console.log(err);
                setTournaments([]);
            }
        })();
    }, []);

    const load = async () => {
        const payload = {
            stations: tournaments
                .find((t) => t._id === selectedTournamentId)
                ?.rounds.find((r) => r._id === selectedRoundId)
                ?.heats.find((h) => h._id === selectedHeatId),
        };

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadTournament`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleTournamentSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedTournamentId(e.target.value);
    };

    const handleRoundSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedRoundId(e.target.value);
    };

    const handleHeatSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedHeatId(e.target.value);
    };

    useEffect(() => {
        setSelectedHeatId("");
        setSelectedRoundId("");
    }, [selectedTournamentId]);

    useEffect(() => {
        setSelectedHeatId("");
    }, [selectedRoundId]);

    return (
        <>
            <h3>Load from Tournament</h3>
            <Select
                label="tournament"
                id="tournament-checkbox"
                onChange={handleTournamentSelectChange}
                input={<OutlinedInput label="Tag" />}
                size="small"
            >
                {tournaments.map((t, i) => (
                    <MenuItem key={i} value={t._id}>
                        {t.name}
                    </MenuItem>
                ))}
            </Select>
            {selectedTournamentId && (
                <Select
                    label="round"
                    id="round-checkbox"
                    onChange={handleRoundSelectChange}
                    input={<OutlinedInput label="Tag" />}
                    size="small"
                >
                    {tournaments
                        .find((t) => t._id === selectedTournamentId)
                        ?.rounds.map((r, i) => (
                            <MenuItem key={i} value={r._id}>
                                {r.name}
                            </MenuItem>
                        ))}
                </Select>
            )}
            {selectedRoundId && (
                <Select
                    label="round"
                    id="round-checkbox"
                    onChange={handleHeatSelectChange}
                    input={<OutlinedInput label="Tag" />}
                    size="small"
                >
                    {tournaments
                        .find((t) => t._id === selectedTournamentId)
                        ?.rounds.find((r) => r._id === selectedRoundId)
                        ?.heats.map((h, i) => (
                            <MenuItem key={i} value={h._id}>
                                {h.name}
                            </MenuItem>
                        ))}
                </Select>
            )}

            {selectedHeatId && (
                <Button variant="outlined" onClick={load} sx={{ mx: 2 }}>
                    Load
                </Button>
            )}
        </>
    );
};

export default TournamentLoader;
