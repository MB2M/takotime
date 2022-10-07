import { useState, useEffect } from "react";

const useStationPayload = (stations: Station[], ranks: StationRanked) => {
    const [stationsPayload, setStationsPayload] = useState<WidescreenStation[]>(
        []
    );

    useEffect(() => {
        if (!stations || !ranks) {
            setStationsPayload([]);
            return;
        }
        
        setStationsPayload(
            stations.map((s) => {
                const r = ranks.find((r) => r.lane === s.laneNumber);

                let rank: Ranks = [];
                if (!r) {
                    rank = [];
                } else {
                    rank = r.rank;
                }
                return {
                    laneNumber: s.laneNumber,
                    externalId: s.externalId,
                    participant: s.participant,
                    category: s.category,
                    reps: s.dynamics?.currentWodPosition?.reps,
                    repsPerBlock: s.dynamics?.currentWodPosition?.repsPerBlock,
                    currentMovement:
                        s.dynamics?.currentWodPosition?.currentMovement,
                    repsOfMovement:
                        s.dynamics?.currentWodPosition?.repsOfMovement,
                    totalRepsOfMovement:
                        s.dynamics?.currentWodPosition?.totalRepsOfMovement,
                    nextMovement: s.dynamics?.currentWodPosition?.nextMovement,
                    nextMovementReps:
                        s.dynamics?.currentWodPosition?.nextMovementReps,
                    result: s.dynamics?.result,
                    measurements: s.dynamics?.measurements,
                    state: s.dynamics?.state,
                    position: {
                        block: s.dynamics?.currentWodPosition?.block,
                        round: s.dynamics?.currentWodPosition?.round,
                        movement: s.dynamics?.currentWodPosition?.movement,
                        reps: s.dynamics?.currentWodPosition?.reps,
                    },
                    rank: rank,
                };
            })
        );
    }, [stations, ranks]);

    return stationsPayload;
};

export default useStationPayload;
