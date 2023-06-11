import { createContext, ReactNode, useContext } from "react";
import { useLiveDataContext } from "../../liveData/livedata";
import { useCompetitionCorner } from "./manager";

const DEFAULT_CC_CONTEXT_VALUE: CompetitionCornerState = {
    epHeat: [],
    heats: [],
    results: [],
};

export interface CompetitionCornerState {
    // workouts: CCWorkout[];
    heats: CCHeat[];
    epHeat: CCEPParticipant[] | undefined;
    results: CCSimpleResult[];
}

export const CompetitionCornerContext = createContext<CompetitionCornerState>(
    DEFAULT_CC_CONTEXT_VALUE
);

export const CompetitionCornerProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { globals } = useLiveDataContext();
    const CCData = useCompetitionCorner(
        globals?.externalEventId,
        globals?.externalWorkoutId,
        globals?.externalHeatId
    );

    return (
        <CompetitionCornerContext.Provider value={CCData}>
            {children}
        </CompetitionCornerContext.Provider>
    );
};

export const useCompetitionCornerContext = () => {
    return useContext<CompetitionCornerState>(CompetitionCornerContext);
};
