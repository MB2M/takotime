import { GetServerSideProps } from "next";
import { getBackendUrl } from "../../utils/requestHost";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";

interface Division {
    title: string;
    id: number;
}

interface Workout {
    name: string;
    id: number;
    externalName: string;
}

interface Props {
    divisions: Division[];
}

const EVENT_ID = 9734;

const semiPositionsToHeat = new Map<number, number>([
    [1, 3],
    [2, 2],
    [3, 1],
    [4, 1],
    [5, 2],
    [6, 3],
    [7, 3],
    [8, 2],
    [9, 1],
    [10, 1],
    [11, 2],
    [12, 3],
    [13, 3],
    [14, 2],
    [15, 1],
    [16, 1],
    [17, 2],
    [18, 3],
]);

const finaleHeats = [
    {
        level: "finale",
        division: 66929,
        heats: [366699, 366700, 366701],
    },
    {
        level: "finale",
        division: 66923,
        heats: [
            372231, 372232, 372233, 372234, 372235, 372236, 372237, 372238,
            372239,
        ],
    },
    {
        level: "finale",
        division: 67854,
        heats: [372207, 372208, 372209],
    },
    {
        level: "finale",
        division: 67855,
        heats: [372213, 372214, 372215],
    },
    {
        level: "semi",
        division: 66923,
        heats: [
            366657, 366658, 366659, 366660, 366661, 366662, 366663, 366664,
            366665,
        ],
    },
];

const fetchWorkouts = async (divisionId: number) => {
    try {
        const response = await fetch(
            `/api/workouts/byDivision?divisionId=${divisionId}&eventId=${EVENT_ID}`
        );

        if (response.ok) {
            return response.json();
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

const fetchScores = async (divisionId: number, workoutId: number) => {
    try {
        const response = await fetch(
            `/api/results/byDivision?divisionId=${divisionId}&eventId=${EVENT_ID}&workoutId=${workoutId}`
        );

        if (response.ok) {
            return response.json();
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

type Athlete = {
    name: string;
    id: number;
    results: {
        workoutId: number;
        score1: string;
        score2: string;
    }[];
    qualifs: {
        scoreQualif: string | number;
        expectedHeat: number;
        expectedLane: number;
        rank: number;
    };
    semi?: { semiExpectedHeat: number; semiExpectedLane: number; rank: number };
    finale?: { rank: number };
};

const generateSemiHeats = (
    athletes: Athlete[],
    divisionId: number,
    level: "semi" | "finale"
) => {
    const heats =
        finaleHeats.find(
            (heat) => heat.division === divisionId && heat.level === level
        )?.heats || [];

    return heats.map((heat, index) => {
        const stations = athletes
            .filter((athlete) => athlete.qualifs.expectedHeat === index + 1)
            .sort((a, b) => a.qualifs.expectedLane - b.qualifs.expectedLane)
            .map((athlete) => ({ id: athlete.id }));

        return {
            id: heat,
            heatName: `(V${index + 1}) Elite - ${level
                .slice(0, 1)
                .toUpperCase()}${level.slice(1)} - ${
                heats.length > 3 ? 3 - Math.floor(index / 3) : 3 - (index % 3)
            }${heats.length > 3 ? ` - ${3 - (index % 3)}` : ""}`,
            stations,
        };
    });
};

const generateEliteMenFinaleHeats = (
    athletes: Athlete[],
    divisionId: number
) => {
    const heats =
        finaleHeats.find(
            (heat) => heat.division === divisionId && heat.level === "finale"
        )?.heats || [];

    return heats.map((heat, index) => {
        const stations = athletes
            .filter((athlete) => athlete.semi?.semiExpectedHeat === index + 1)
            .sort(
                (a, b) => a.semi?.semiExpectedLane! - b.semi?.semiExpectedLane!
            )
            .map((athlete) => ({ id: athlete.id }));

        return {
            id: heat,
            heatName: `(V${index + 1}) Elite - Finale - ${
                3 - Math.floor(index / 3)
            }${heats.length > 3 ? ` - ${3 - (index % 3)}` : ""}`,
            stations,
        };
    });
};

function generateSemiScores(athletes: Athlete[], workoutId: number) {
    return athletes.map((athlete) => {
        return {
            id: athlete.id,
            score: athlete.semi?.rank || 0,
            tiebreakerScore:
                athlete.results.find((result) => result.workoutId === workoutId)
                    ?.score2 || "",
        };
    });
}

function generateFinaleScores(athletes: Athlete[], workoutId: number) {
    return athletes.map((athlete) => ({
        id: athlete.id,
        score: athlete.finale?.rank || 0,
        tiebreakerScore:
            athlete.results.find((result) => result.workoutId === workoutId)
                ?.score2 || "",
    }));
}

const Event1 = ({ divisions }: Props) => {
    const [selectedDivisionId, setSelectedDivisionId] = useState<number>(
        divisions[0].id
    );

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    useEffect(() => {
        (async () => {
            const workouts = (await fetchWorkouts(
                selectedDivisionId
            )) as Workout[];
            setWorkouts(
                workouts
                    .filter(
                        (workout) =>
                            workout.name.includes("E1") &&
                            !workout.name.toLowerCase().includes("total")
                    )
                    .sort((a, b) => (a.externalName < b.externalName ? -1 : 1))
            );
        })();
    }, [selectedDivisionId]);

    useEffect(() => {
        (async () => {
            let allAthletes: {
                displayName: string;
                id: number;
                result: { scores: { value: string }[]; workoutId: number }[];
            }[] = [];
            await Promise.all(
                workouts.map(async (workout) => {
                    const athletes = await fetchScores(
                        selectedDivisionId,
                        workout.id
                    );
                    allAthletes = [...allAthletes, ...athletes];
                    // setAthletes((current) => [...current, ...athletes]);
                })
            );
            let structuredAthletes: Omit<Athlete, "qualifs">[] = [];
            const uniqueAthlete = [
                ...new Set(
                    allAthletes
                        .map((athlete) => ({
                            name: athlete.displayName,
                            id: athlete.id,
                        }))
                        .filter(
                            (ath, index, array) =>
                                index ===
                                array.findIndex((a) => a.name === ath.name)
                        )
                ),
            ];
            uniqueAthlete.forEach((athlete) => {
                structuredAthletes.push({
                    ...athlete,
                    results: allAthletes
                        .filter((ath) => ath.id === athlete.id)
                        .map((ath) => ({
                            score1: ath.result[0]?.scores?.[0]?.value,
                            score2: ath.result[0]?.scores?.[1]?.value,
                            workoutId: ath.result[0]?.workoutId,
                        })),
                });
            });

            const sss = structuredAthletes.map(
                (athlete: Omit<Athlete, "qualifs">) => {
                    const P1 = athlete.results.find(
                        (result) => result.workoutId === workouts[0].id
                    )?.score1;
                    const P2 = athlete.results.find(
                        (result) => result.workoutId === workouts[1].id
                    )?.score1;

                    const total = [P1, P2].includes("WD")
                        ? "WD"
                        : Date.parse(`1970-01-01T00:${P1}Z`) +
                          Date.parse(`1970-01-01T00:${P2}Z`);
                    const scoreP1P2 =
                        total === "WD"
                            ? "WD"
                            : isNaN(total)
                            ? ""
                            : new Date(total).getTime();

                    return {
                        ...athlete,
                        qualifs: { scoreQualif: scoreP1P2 },
                    };
                }
            );

            const athleteCopy = [...sss];
            athleteCopy.sort((a, b) => {
                if (
                    a.qualifs.scoreQualif === "WD" &&
                    b.qualifs.scoreQualif === "WD"
                )
                    return 0;
                if (
                    a.qualifs.scoreQualif === "" &&
                    b.qualifs.scoreQualif === ""
                )
                    return 0;
                if (a.qualifs.scoreQualif === "WD") return 1;
                if (b.qualifs.scoreQualif === "WD") return -1;
                if (a.qualifs.scoreQualif === "") return 1;
                if (b.qualifs.scoreQualif === "") return -1;

                if (
                    isNaN(+a.qualifs.scoreQualif) ||
                    isNaN(+b.qualifs.scoreQualif)
                )
                    return 0;

                return +a.qualifs.scoreQualif - +b.qualifs.scoreQualif;
            });
            const newAthletes = sss.map((athlete) => {
                const index = athleteCopy.findIndex((a) => a.id === athlete.id);

                let expectedHeat: number;

                let lane: number;

                //QUALIFICATIONS
                switch (selectedDivisionId) {
                    case 66923:
                        const tiers = 2 - Math.floor(index / 18);
                        expectedHeat =
                            semiPositionsToHeat.get((index % 18) + 1)! +
                            tiers * 3;
                        lane = Math.floor((index % 18) / 3) + 1;

                        break;
                    default:
                        expectedHeat = 3 - Math.floor(index / 6);
                        lane = Math.floor(index % 6) + 1;
                        break;
                }
                const expectedLane =
                    3 + Math.floor(lane / 2) * (lane % 2 === 0 ? 1 : -1);

                const rank =
                    athleteCopy.findIndex(
                        (a) =>
                            a.qualifs.scoreQualif ===
                            athlete.qualifs.scoreQualif
                    ) + 1;

                return {
                    ...athlete,
                    qualifs: {
                        ...athlete.qualifs,
                        expectedHeat,
                        expectedLane,
                        rank,
                    },
                };
            });

            let athletesWithFinale: Athlete[];

            switch (selectedDivisionId) {
                case 66923:
                    const athletesWithSemi = newAthletes.map(
                        (athlete, index, array) => {
                            // let semiScore = athlete.results.find(
                            //     (result) => result.workoutId === workouts[2].id
                            // )?.score2!;

                            let semiRank =
                                [...array]
                                    .filter((a) => {
                                        return (
                                            a.qualifs.expectedHeat ===
                                            athlete.qualifs.expectedHeat
                                        );
                                    })
                                    .sort((a, b) => {
                                        const scoreA =
                                            a.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts[2].id
                                            )?.score2 || "";

                                        const scoreB =
                                            b.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts[2].id
                                            )?.score2 || "";

                                        if (!scoreA && !scoreB)
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );
                                        if (!scoreA) return 1;
                                        if (!scoreB) return -1;

                                        if (scoreA === scoreB) {
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );
                                        }

                                        return scoreA < scoreB ? -1 : 1;
                                    })
                                    // .map(
                                    //     (a) =>
                                    //         a.results.find(
                                    //             (result) =>
                                    //                 result.workoutId ===
                                    //                 workouts[2].id
                                    //         )?.score2
                                    // )
                                    .map((a) => a.id)
                                    .indexOf(athlete.id) + 1;

                            let semiExpectedHeat =
                                (Math.ceil(athlete.qualifs.expectedHeat / 3) -
                                    1) *
                                    3 +
                                1 +
                                (2 - Math.floor((semiRank - 1) / 2));

                            const lane =
                                2 -
                                ((athlete.qualifs.expectedHeat + 2) % 3) +
                                1 +
                                3 * ((semiRank + 1) % 2);

                            let semiExpectedLane =
                                3 +
                                Math.floor(lane / 2) *
                                    (lane % 2 === 0 ? 1 : -1);
                            return {
                                ...athlete,
                                semi: {
                                    semiExpectedHeat,
                                    semiExpectedLane,
                                    rank: semiRank,
                                },
                            };
                        }
                    );
                    athletesWithFinale = athletesWithSemi.map(
                        (athlete, index, array) => {
                            // const finaleScore =
                            //     athlete.results.find(
                            //         (result) =>
                            //             result.workoutId === workouts.at(-1)?.id
                            //     )?.score2! || "";

                            const finaleRank =
                                [...array]
                                    .filter((a) => {
                                        return (
                                            a.semi.semiExpectedHeat ===
                                            athlete.semi.semiExpectedHeat
                                        );
                                    })
                                    .sort((a, b) => {
                                        const scoreA =
                                            a.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts.at(-1)?.id
                                            )?.score2 || "";

                                        const scoreB =
                                            b.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts.at(-1)?.id
                                            )?.score2 || "";

                                        if (!scoreA && !scoreB)
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );
                                        if (!scoreA) return 1;
                                        if (!scoreB) return -1;

                                        if (scoreA === scoreB) {
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );
                                        }

                                        return scoreA < scoreB ? -1 : 1;
                                    })
                                    .map((a) => a.id)
                                    // .map(
                                    //     (a) =>
                                    //         a.results.find(
                                    //             (result) =>
                                    //                 result.workoutId ===
                                    //                 workouts.at(-1)?.id
                                    //         )?.score2 || ""
                                    // )

                                    .indexOf(athlete.id) +
                                1 +
                                6 * (9 - athlete.semi.semiExpectedHeat);

                            return {
                                ...athlete,
                                finale: {
                                    rank: finaleRank,
                                },
                            };
                        }
                    );

                    break;
                default:
                    athletesWithFinale = newAthletes.map(
                        (athlete, index, array) => {
                            // const finaleScore =
                            //     athlete.results.find(
                            //         (result) =>
                            //             result.workoutId === workouts.at(-1)?.id
                            //     )?.score2! || "";

                            const finaleRank =
                                [...array]
                                    .filter((a) => {
                                        return (
                                            a.qualifs.expectedHeat ===
                                            athlete.qualifs.expectedHeat
                                        );
                                    })
                                    .sort((a, b) => {
                                        const scoreA =
                                            a.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts.at(-1)?.id
                                            )?.score2 || "";

                                        const scoreB =
                                            b.results.find(
                                                (result) =>
                                                    result.workoutId ===
                                                    workouts.at(-1)?.id
                                            )?.score2 || "";

                                        if (!scoreA && !scoreB)
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );
                                        if (!scoreA) return 1;
                                        if (!scoreB) return -1;

                                        if (scoreA === scoreB)
                                            return (
                                                a.qualifs.rank - b.qualifs.rank
                                            );

                                        return scoreA < scoreB ? -1 : 1;
                                    })
                                    .map((a) => a.id)
                                    // .map(
                                    //     (a) =>
                                    //         a.results.find(
                                    //             (result) =>
                                    //                 result.workoutId ===
                                    //                 workouts.at(-1)?.id
                                    //         )?.score2 || ""
                                    // )

                                    .indexOf(athlete.id) +
                                1 +
                                6 * (3 - athlete.qualifs.expectedHeat);

                            return {
                                ...athlete,
                                finale: {
                                    rank: finaleRank,
                                },
                            };
                        }
                    );
                    break;
            }
            setAthletes(athletesWithFinale);
        })();
    }, [workouts]);

    const handleSendHeats = async (
        level: "semi" | "finale",
        workoutId?: number
    ) => {
        if (!workoutId) return;

        const heats =
            level === "semi"
                ? generateSemiHeats(athletes, selectedDivisionId, level)
                : selectedDivisionId !== 66923
                ? generateSemiHeats(athletes, selectedDivisionId, level)
                : generateEliteMenFinaleHeats(athletes, selectedDivisionId);

        try {
            const response = await fetch(
                `/api/mt23/wod1?eventId=${EVENT_ID}&workoutId=${workoutId}`,
                {
                    method: "POST",
                    body: JSON.stringify(heats),
                }
            );
            if (response.ok) {
                alert("heat successfully updated");
            } else {
                alert("error updating heat");
            }
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    };

    const handleSendScores = async (
        level: "semi" | "finale",
        workoutId?: number
    ) => {
        if (!workoutId) return;
        const scores =
            level === "finale"
                ? generateFinaleScores(athletes, workoutId)
                : generateSemiScores(athletes, workoutId);

        try {
            const response = await fetch(
                `/api/mt23/updateResults?eventId=${EVENT_ID}&workoutId=${workoutId}`,
                {
                    method: "POST",
                    body: JSON.stringify(scores),
                }
            );
            if (response.ok) {
                alert("scores successfully updated");
            } else {
                alert("error updating heat");
            }
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    };

    return (
        <Box>
            <Typography variant={"h6"}>Select Division</Typography>
            <Box
                display={"flex"}
                gap={2}
                alignItems={"center"}
                flexDirection={"row"}
            >
                {divisions.map((division) => (
                    <Button
                        size={"small"}
                        variant={
                            division.id === selectedDivisionId
                                ? "contained"
                                : "outlined"
                        }
                        key={division.id}
                        onClick={() => setSelectedDivisionId(division.id)}
                    >
                        {division.title}
                    </Button>
                ))}
            </Box>
            <Box>
                {workouts.map((workout) => (
                    <Typography key={workout.externalName}>
                        {workout.externalName}
                    </Typography>
                ))}
            </Box>

            <Box py={2}>
                <Typography variant={"h3"} textAlign={"center"}>
                    Qualifications
                </Typography>
                <Box py={2} display={"flex"} gap={2} justifyContent={"center"}>
                    {selectedDivisionId === 66923 && (
                        <>
                            <Button
                                variant={"contained"}
                                onClick={() =>
                                    handleSendHeats("semi", workouts[2]?.id)
                                }
                            >
                                Generate semi Heats
                            </Button>
                            <Button
                                variant={"contained"}
                                onClick={() =>
                                    handleSendScores("semi", workouts[2].id)
                                }
                                color={"secondary"}
                            >
                                send semi score
                            </Button>
                        </>
                    )}
                    <Button
                        variant={"contained"}
                        onClick={() =>
                            handleSendHeats("finale", workouts.at(-1)?.id)
                        }
                    >
                        Generate finale Heats
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={() =>
                            handleSendScores("finale", workouts.at(-1)?.id)
                        }
                        color={"secondary"}
                    >
                        send finale score
                    </Button>
                </Box>
            </Box>
            <TableContainer
                component={Paper}
                sx={{ maxWidth: "80%", mx: "auto" }}
            >
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align={"right"}>Score P1</TableCell>
                            <TableCell align={"right"}>Score P2</TableCell>
                            <TableCell align={"right"}>Score Total</TableCell>
                            <TableCell align={"right"}>Rank</TableCell>
                            <TableCell align={"right"}>Next Heat</TableCell>
                            <TableCell align={"right"}>Next Lane</TableCell>
                            {selectedDivisionId === 66923 && (
                                <>
                                    <TableCell align={"right"}>
                                        Semi Score
                                    </TableCell>
                                    <TableCell align={"right"}>Rank</TableCell>
                                    <TableCell align={"right"}>
                                        Next Heat
                                    </TableCell>
                                    <TableCell align={"right"}>
                                        Next Lane
                                    </TableCell>
                                </>
                            )}
                            <TableCell align={"right"}>Score Finale</TableCell>
                            <TableCell align={"right"}>Finale Rank</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {athletes
                            .sort((a, b) => {
                                if (a.finale?.rank === b.finale?.rank) {
                                    if (a.qualifs.scoreQualif === "WD")
                                        return 1;
                                    if (b.qualifs.scoreQualif === "WD")
                                        return -1;
                                    if (a.qualifs.scoreQualif === "") return 1;
                                    if (b.qualifs.scoreQualif === "") return -1;

                                    return (
                                        +a.qualifs.scoreQualif -
                                        +b.qualifs.scoreQualif
                                    );
                                } else {
                                    if (!a.finale?.rank) return 1;
                                    if (!b.finale?.rank) return -1;
                                    return a.finale.rank - b.finale.rank;
                                }
                            })
                            .map((athlete) => {
                                const P1 = athlete.results.find(
                                    (result) =>
                                        result.workoutId === workouts?.[0]?.id
                                )?.score1;
                                const P2 = athlete.results.find(
                                    (result) =>
                                        result.workoutId === workouts?.[1]?.id
                                )?.score1;

                                const semi = athlete.results.find(
                                    (result) =>
                                        result.workoutId === workouts[2]?.id
                                )?.score2;

                                const finale = athlete.results.find(
                                    (result) =>
                                        result.workoutId === workouts.at(-1)?.id
                                )?.score2;

                                return (
                                    <TableRow key={athlete.name}>
                                        <TableCell component="th" scope="row">
                                            {athlete.name}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {P1}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {P2}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {!isNaN(
                                                +athlete.qualifs.scoreQualif
                                            ) &&
                                            athlete.qualifs.scoreQualif != ""
                                                ? `${new Date(
                                                      athlete.qualifs.scoreQualif
                                                  ).getUTCMinutes()}:${new Date(
                                                      athlete.qualifs.scoreQualif
                                                  ).getUTCSeconds()}.${new Date(
                                                      athlete.qualifs.scoreQualif
                                                  ).getUTCMilliseconds()}`
                                                : athlete.qualifs.scoreQualif}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {athlete.qualifs.rank}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {athlete.qualifs.expectedHeat}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {athlete.qualifs.expectedLane}
                                        </TableCell>
                                        {selectedDivisionId === 66923 && (
                                            <>
                                                <TableCell align={"right"}>
                                                    {semi}
                                                </TableCell>
                                                <TableCell align={"right"}>
                                                    {athlete.semi?.rank}
                                                </TableCell>
                                                <TableCell align={"right"}>
                                                    {
                                                        athlete.semi
                                                            ?.semiExpectedHeat
                                                    }
                                                </TableCell>
                                                <TableCell align={"right"}>
                                                    {
                                                        athlete.semi
                                                            ?.semiExpectedLane
                                                    }
                                                </TableCell>
                                            </>
                                        )}
                                        <TableCell align={"right"}>
                                            {finale}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {athlete.finale?.rank}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Event1;

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const resp = await fetch(
            `http://${getBackendUrl(context.req)}/live/api/cc-token`
        );
        const accessToken = (await resp.json()).token;

        const response = await fetch(
            `https://competitioncorner.net/api2/v1/events/${EVENT_ID}/divisions`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const json = (await response.json()) as Division[];
            return {
                props: {
                    divisions: json.filter((division) =>
                        division.title.includes("Elite")
                    ),
                },
            };
        } else {
            throw new Error("bad request");
        }
    } catch (err) {
        console.log(err);
        return { props: { divisions: [] } };
    }
};
