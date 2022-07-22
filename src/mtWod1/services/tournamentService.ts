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
    const tournament = await Tournament.findById(id).exec();
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

export {
    newTournament,
    viewTournaments,
    changeTournament,
    viewTournament,
    delTournament,
};
