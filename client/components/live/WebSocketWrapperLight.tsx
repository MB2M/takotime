import { Children, cloneElement, useEffect, useRef, useState } from "react";
import WebsocketConnection from "./WebsocketConnection";

const WebsocketWrapperLight = ({ children }: any) => {
    const [loadedWorkouts, setLoadedWorkouts] = useState<Workout[]>([]);
    const [stationStatics, setStationStatics] = useState<StationStatics[]>([]);
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [globals, setGlobals] = useState<Globals>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

        switch (topic) {
            case "staticsUpdate":
                setStationStatics(message);
                break;
            case "rank":
                setRanks(message);
                break;
            case "globalsUpdate":
                setGlobals(message);
                break;
            case "loadedWorkouts":
                setLoadedWorkouts(message);
                break;
            default:
                break;
        }
    };

    const stationPayload = () => {
        return stationStatics.map((s) => ({
            laneNumber: s.laneNumber,
            externalId: s.externalId,
            participant: s.participant,
            category: s.category,
            repsPerBlock: s.dynamics?.currentWodPosition?.repsPerBlock,
            currentMovement: s.dynamics?.currentWodPosition?.currentMovement,
            repsOfMovement: s.dynamics?.currentWodPosition?.repsOfMovement,
            totalRepsOfMovement:
                s.dynamics?.currentWodPosition?.totalRepsOfMovement,
            nextMovement: s.dynamics?.currentWodPosition?.nextMovement,
            nextMovementReps: s.dynamics?.currentWodPosition?.nextMovementReps,
            result: s.dynamics?.result,
            measurements: s.dynamics?.measurements,
            state: s.dynamics?.state,
            position: {
                block: s.dynamics?.currentWodPosition?.block,
                round: s.dynamics?.currentWodPosition?.round,
                movement: s.dynamics?.currentWodPosition?.movement,
                reps: s.dynamics?.currentWodPosition?.reps,
            },
            rank: ranks.find((r) => r.lane === s.laneNumber)?.rank,
        }));
    };

    const childrenWithProps = Children.map(children, (child, index) => {
        return cloneElement(child, {
            data: {
                globals,
                stations: stationPayload(),
                workouts: loadedWorkouts,
            },
        });
    });

    return (
        <>
            <WebsocketConnection handleData={handleData} ws={ws} />
            <div>{childrenWithProps}</div>
        </>
    );
};

export default WebsocketWrapperLight;