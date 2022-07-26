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

const updateTournament = async (
    tournamentId: string,
    payload: Object,
    params?: Object
) => {
    let paramsString = "";
    if (params) {
        paramsString = Object.entries(params).reduce((p, c) => {
            return `${p}${p!=="" ? "$" : ""}${c[0]}=${c[1]}`;
        }, "");
    }

    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournamentId}?${paramsString}`,
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
