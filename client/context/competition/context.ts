import { createContext, useContext } from "react";
import { DEFAULT_COMPETITION_CONTEXT_VALUE } from "./model";

export const CompetitionContext = createContext<Competition | undefined>(
    DEFAULT_COMPETITION_CONTEXT_VALUE
);

export const useCompetitionContext = () => {
    return useContext<Competition | undefined>(CompetitionContext);
};
