import { Button, Link, TextField, Typography } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

const Wod1 = ({ tournaments }: { tournaments: Tournament[] }) => {
    const [newTournamentName, setNewTournamentName] = useState<string>("");

    const handleAddTournament = async () => {
        if (newTournamentName === "") return;
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments`,
            {
                method: "POST",
                body: JSON.stringify({ name: newTournamentName }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    };

    return (
        <>
            <Typography>Admin MT wod 1</Typography>
            <TextField
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
            ></TextField>
            <Button onClick={handleAddTournament}>Add new tournament</Button>
            <Typography>liste des tournois</Typography>
            <div>
                {tournaments.map((t) => (
                    <div>
                        <Link href={`/mt22/wod1/tournaments/${t._id}`}>
                            {t.name}: {t.rounds.length} rounds
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
        return { props: { tournaments } };
    } catch (err) {
        console.log(err);
        return { props: { tournaments: [] } };
    }
};

export default Wod1;
