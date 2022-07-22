const getTournament = async (tournamentId: string) => {
    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournamentId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const tournament: Tournament = await response.json();
            return tournament;
        }
    } catch (err) {
        console.log(err);
    }
};

const updateTournament = async (tournamentId: string, payload: Object) => {
    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournamentId}`,
            {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err) {
        console.log(err);
    }
};

export { getTournament, updateTournament };
