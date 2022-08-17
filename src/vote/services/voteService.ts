import Choice from "../models/Choice";

const vote = async (choice: string) => {
    const newChoice = await Choice.addChoice(choice);
    return newChoice;
};

const getAll = async () => {
    const votes = await Choice.find();
    return votes;
};

const resetAll = async () => {
    const votes = await Choice.resetAll();
    return votes;
};

const deleteAll = async () => {
    const votes = await Choice.deleteAll();
    return votes;
};

export { vote, getAll, resetAll, deleteAll };
