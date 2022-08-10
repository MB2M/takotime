import { cp } from "node:fs";
import Tournament from "../models/Tournament";

type Tournament = {
    name: string;
    rounds: Heat[];
};

type Heat = {
    results: Result[];
};

type Result = {
    athleteSources: string[];
    station: number;
    participant: Participant;
    result: number;
    state: string;
};

type Participant = {
    name: string;
    customId: string;
};

const newTournament = async (data: Tournament) => {
    const tournament = await Tournament.create(data);
    return tournament;
};

const viewTournaments = async () => {
    const tournaments = await Tournament.find().exec();
    return tournaments;
};

const viewTournament = async (id: string) => {
    const tournament = await Tournament.findById(id, "_id name rounds").exec();
    return tournament;
};

const changeTournament = async (data: Tournament, id: string) => {
    const tournament = await Tournament.findByIdAndUpdate(id, data).exec();
    return tournament;
};

const delTournament = async (id: string) => {
    const tournament = await Tournament.findByIdAndDelete(id).exec();
    return tournament;
};

const calculateTournamentRank = async (id: string) => {
    const tournament = await Tournament.findById(id).exec();

    if (!tournament) return;

    tournament.rounds.forEach(
        (round: {
            customId: string;
            draftQualifiedOverallNumber: any;
            finished: boolean;
            topQualifPerHeatNumber: number;
            eliminatedNumber: number;
            heats: any[];
            state: string;
            points?: number[];
        }) => {
            let finished = true;
            round.heats.forEach(
                (heat: {
                    customId: string;
                    state: "NF" | "F";
                    results: any[];
                }) => {
                    heat.results.sort(sortResult);

                    heat.results.forEach((result, index) => {
                        if (heat.state === "NF") {
                            finished = false;
                            result.state = "R";
                            return;
                        }

                        if (!!round.points?.length) {
                            result.points = round.points[index];
                            result.state = "DP";
                        }

                        if (index < round.topQualifPerHeatNumber) {
                            result.state = "Q";
                            return;
                        }

                        if (
                            heat.results.length - index <=
                            round.eliminatedNumber
                        ) {
                            result.state = "E";
                            return;
                        }

                        result.state = "D";
                    });
                }
            );
            round.finished = finished;
            let roundResults = round.heats.flatMap((h) => h.results);
            roundResults.sort(sortResult);

            let toDraft = round.draftQualifiedOverallNumber;
            roundResults.forEach((result, i) => {
                if (["Q", "E", "R"].includes(result.state)) {
                    return;
                }

                if (toDraft) {
                    result.state = round.finished ? "DQ" : "W";
                    toDraft -= 1;
                    return;
                }
            });
            // MISE A JOUR DES AUTRES ROUNDS
            let excludedSources: string[] = [];
            let waitingSources: string[] = [];
            round.heats.forEach((heat) => {
                heat.results.forEach(
                    (result: {
                        participant: any;
                        athleteSources: string[];
                    }) => {
                        let previousSource = "";
                        result.athleteSources.forEach((source) => {
                            if (excludedSources.includes(source)) return;
                            if (["D", "Q", "DQ"].includes(previousSource))
                                return;
                            if (previousSource === "W") {
                                waitingSources.push(source);
                                return;
                            }
                            if (waitingSources.includes(source)) {
                                previousSource = "W";
                                return;
                            }

                            const round = source.slice(0, 2);
                            const heat = source.slice(3, 5);
                            const rank = source.slice(6);

                            let foundResult: any;
                            if (["DP"].includes(heat)) {
                                foundResult = tournament.rounds
                                    .find(
                                        (r: { customId: string }) =>
                                            r.customId === round
                                    )
                                    ?.heats.flatMap(
                                        (h: { results: any }) => h.results
                                    );

                                foundResult = [
                                    ...new Set(
                                        foundResult?.map(
                                            (r: {
                                                participant: { name: any };
                                            }) => r.participant.name
                                        )
                                    ),
                                ]
                                    .map((p) => {
                                        const pointsSum = foundResult
                                            ?.filter(
                                                (r: {
                                                    participant: {
                                                        name: unknown;
                                                    };
                                                }) => r.participant.name === p
                                            )
                                            .reduce(
                                                (p: any, c: { points: any }) =>
                                                    p + (c.points || 0),
                                                0
                                            );

                                        return {
                                            participant: foundResult.find(
                                                (r: {
                                                    participant: {
                                                        name: unknown;
                                                    };
                                                }) => r.participant.name === p
                                            )?.participant || {
                                                customId: "",
                                                name: "",
                                            },
                                            station:
                                                foundResult.find(
                                                    (r: {
                                                        participant: {
                                                            name: unknown;
                                                        };
                                                    }) =>
                                                        r.participant.name === p
                                                )?.station || 1,
                                            result: pointsSum.toString(),
                                            state: "DP",
                                        };
                                    })
                                    .sort(sortResult)
                                    .filter(
                                        (result: { state: string }) =>
                                            result.state === "DP"
                                    )?.[Number(rank) - 1];

                                if (["DP"].includes(foundResult?.state)) {
                                    result.participant =
                                        foundResult.participant;
                                    excludedSources.push(source);
                                    previousSource = foundResult.state;
                                } else {
                                    result.participant = {
                                        name: "TBD",
                                        customId: "",
                                    };
                                }
                            } else if (["DQ"].includes(heat)) {
                                foundResult = tournament.rounds
                                    .find(
                                        (r: { customId: string }) =>
                                            r.customId === round
                                    )
                                    ?.heats.flatMap(
                                        (h: { results: any }) => h.results
                                    )
                                    .sort(sortResult)
                                    .filter(
                                        (result: { state: string }) =>
                                            result.state === heat
                                    )?.[Number(rank) - 1];

                                if (["DQ"].includes(foundResult?.state)) {
                                    result.participant =
                                        foundResult.participant;
                                    excludedSources.push(source);
                                    previousSource = foundResult.state;
                                } else {
                                    result.participant = {
                                        name: "TBD",
                                        customId: "",
                                    };
                                }
                            } else {
                                foundResult = tournament.rounds
                                    .find(
                                        (r: { customId: string }) =>
                                            r.customId === round
                                    )
                                    ?.heats.find((h: { customId: string }) => {
                                        return h.customId === heat;
                                    })?.results[Number(rank) - 1];
                                if (["Q", "D"].includes(foundResult?.state)) {
                                    result.participant =
                                        foundResult.participant;
                                    excludedSources.push(source);
                                    previousSource = foundResult.state;
                                } else {
                                    result.participant = {
                                        name: "TBD",
                                        customId: "",
                                    };
                                }
                            }

                            if (foundResult?.state === "W") {
                                waitingSources.push(source);
                                previousSource = "W";
                            }
                        });
                    }
                );
            });
        }
    );
    tournament.save();
    return tournament;
};

const sortResult = (a: { result: string }, b: { result: string }) => {
    if (a.result.includes(":") && !b.result.includes(":")) return -1;
    if (b.result.includes(":") && !a.result.includes(":")) return 1;
    if (!a.result.includes(":") && !b.result.includes(":"))
        return Number(b.result) - Number(a.result);
    return (
        Number(a.result.replace(":", "")) - Number(b.result.replace(":", ""))
    );
};

export {
    newTournament,
    viewTournaments,
    changeTournament,
    viewTournament,
    delTournament,
    calculateTournamentRank,
};
