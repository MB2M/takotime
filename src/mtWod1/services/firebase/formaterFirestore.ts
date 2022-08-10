import { ITournament } from "../../../types/mt";

const formatTournamentsPayload = (payload: ITournament & { _id: string }) => {
    // const heatAsObject = payload.rounds.reduce(
    //     (
    //         p: any,
    //         c: {
    //             heats: any;
    //             _id: any;
    //         }
    //     ) => ({
    //         ...p,
    //         [c._id]: c.heats.reduce(
    //             (
    //                 ph: any,
    //                 ch: {
    //                     name: any;
    //                     results: any;
    //                     state: any;
    //                     _id: any;
    //                 }
    //             ) => ({
    //                 ...ph,
    //                 [ch._id]: {
    //                     name: ch.name,
    //                     results: ch.results.reduce(
    //                         (
    //                             pp: any,
    //                             cp: {
    //                                 station: any;
    //                                 participant: { name: any };
    //                                 result: any;
    //                                 state: any;
    //                             }
    //                         ) => ({
    //                             ...pp,
    //                             [cp.station]: {
    //                                 participant: cp.participant.name,
    //                                 result: cp.result,
    //                                 state: cp.state,
    //                             },
    //                         }),
    //                         {}
    //                     ),
    //                     state: ch.state,
    //                 },
    //             }),
    //             {}
    //         ),
    //     }),
    //     {}
    // );

    const roundAsObject = payload.rounds.reduce(
        (
            p: any,
            c: {
                points: any;
                ranking: any;
                customId: any;
                draftQualifiedOverallNumber: any;
                topQualifPerHeatNumber: any;
                name: any;
                finished: any;
                heats: any;
                _id: any;
            }
        ) => {
            return {
                ...p,
                [c._id]: {
                    name: c.name,
                    finished: c.finished,
                    directQualifier: c.topQualifPerHeatNumber,
                    draftQualified: c.draftQualifiedOverallNumber,
                    customId: c.customId,
                    ranking: c.ranking || { start: 0, end: 0 },
                    points: c.points,
                    heats: c.heats.reduce(
                        (
                            ph: any,
                            ch: {
                                customId: any;
                                name: any;
                                results: any;
                                state: any;
                                _id: any;
                            }
                        ) => ({
                            ...ph,
                            [ch._id]: {
                                name: ch.name,
                                customId: ch.customId,
                                results: ch.results.reduce(
                                    (
                                        pp: any,
                                        cp: {
                                            points: any;
                                            station: any;
                                            participant: { name: any };
                                            result: any;
                                            state: any;
                                        }
                                    ) => ({
                                        ...pp,
                                        [cp.station]: {
                                            participant: cp.participant.name,
                                            result: cp.result,
                                            state: cp.state,
                                            points: cp.points || 0,
                                        },
                                    }),
                                    {}
                                ),
                                state: ch.state,
                            },
                        }),
                        {}
                    ),
                },
            };
        },
        {}
    );

    const tournament = {
        name: payload.name,
        id: payload._id,
        rounds: roundAsObject,
    };

    return tournament;
};

export { formatTournamentsPayload };
