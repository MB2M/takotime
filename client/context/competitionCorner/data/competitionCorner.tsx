import { createContext, ReactNode, useContext, useEffect } from "react";
import { useLiveDataContext } from "../../liveData/livedata";
import { useCompetitionCorner } from "./manager";

const DEFAULT_CC_CONTEXT_VALUE: CompetitionCornerState = {
    epHeat: [],
    heats: [],
};

export interface CompetitionCornerState {
    // workouts: CCWorkout[];
    heats: CCHeat[];
    epHeat: CCEPParticipant[] | undefined;
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

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/CCtoken");

                if (response.ok) {
                    sessionStorage.setItem("CC_TOKEN", await response.text());
                } else {
                    sessionStorage.removeItem("CC_TOKEN");
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return (
        <CompetitionCornerContext.Provider value={CCData}>
            {children}
        </CompetitionCornerContext.Provider>
    );
};

export const useCompetitionCornerContext = () => {
    return useContext<CompetitionCornerState>(CompetitionCornerContext);
};
