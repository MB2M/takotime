import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";
import useStationWs from "../hooks/bigscreen/useStationWs";
import { useCompetitionContext } from "../context/competition";

const withData = (Component: React.FC<any>) => {
    return (props: any) => {
        const [parent] = useAutoAnimate({
            duration: 500,
            easing: "ease-in-out",
        });

        const { globals } = useLiveDataContext();
        const { timer, plainTimer } = useChrono(
            globals?.startTime,
            globals?.duration
        );

        const { fullStations, activeWorkout, workouts, categories } =
            useStationWs();

        console.log(fullStations);

        const competition = useCompetitionContext();

        return (
            <Component
                {...props}
                parent={parent}
                timer={timer}
                plainTimer={plainTimer}
                fullStations={fullStations}
                workout={activeWorkout}
                workouts={workouts}
                competition={competition}
                state={globals?.state}
                categories={categories}
            />
        );
    };
};

export default withData;
