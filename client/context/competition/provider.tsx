import { ReactNode } from "react";
import WebsocketConnection from "../../components/live/WebsocketConnection";
import { CompetitionContext } from "./context";
import useCompetition from "./manager";

const CompetitionProvider = ({ children }: { children: ReactNode }) => {
    const { competition, ws, handleData } = useCompetition();
    const hostname = process.env.NEXT_PUBLIC_LOCAL_HOSTNAME;

    return (
        <CompetitionContext.Provider value={competition}>
            <WebsocketConnection
                handleData={handleData}
                ws={ws}
                hostname={hostname}
            />
            {children}
        </CompetitionContext.Provider>
    );
};

export default CompetitionProvider;
