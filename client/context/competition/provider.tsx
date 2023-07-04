import { ReactNode } from "react";
import { CompetitionContext } from "./context";
import useCompetition from "./manager";

const CompetitionProvider = ({ children }: { children: ReactNode }) => {
    const { competition } = useCompetition();

    return (
        <CompetitionContext.Provider value={competition}>
            {children}
        </CompetitionContext.Provider>
    );
};

export default CompetitionProvider;
