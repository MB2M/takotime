// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getBackendUrl } from "../../../utils/requestHost";

const BASE_URL = "https://competitioncorner.net/api2/v1";

const EVENT_ID = 9734;

const workouts = [
    { division: 66923, ids: [60366, 60367, 60383, 60388] },
    { division: 66929, ids: [60366, 60367, 60439] },
];
const divisions = [66923, 66929];

const resetScores = async (
    workoutId: string,
    eventId: string,
    accessToken: string,
    divisionId: string
) => {
    await fetch(
        `${BASE_URL}/results/event/${eventId}/workout/${workoutId}/reset-scores?divisionId=${divisionId}&format=individual&password=${process.env.CC_PASSWORD}`,
        {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
        }
    );
};

const getAthletes = async (
    eventId: string,
    divisionId: string,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_URL}/events/${eventId}/crossfit-athletes?=&page=1&per_page=100&divisionId=${divisionId}`,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
        }
    );

    return response.json() as Promise<
        {
            participantId: number;
            fullName: string;
            athleteDivisionId: number;
        }[]
    >;
};

function generateScore(withWD = false) {
    if (withWD && Math.floor(Math.random() * 100) < 2) return "WD";

    const finished = Math.floor(Math.random() * 100) > 9;
    if (finished) {
        const minutes = Math.floor(Math.random() * 2);
        const seconds = Math.floor(Math.random() * 60);
        const milliseconds = Math.floor(Math.random() * 1000);
        return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}.${
            milliseconds < 10
                ? `00${milliseconds}`
                : milliseconds < 100
                ? `0${milliseconds}`
                : milliseconds
        }`;
    } else {
        const failedLift = Math.floor(Math.random() * 5);
        return `02:${(failedLift + 1) * 10}.000`;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const resp = await fetch(
            `http://${getBackendUrl(req)}/live/api/cc-token`
        );
        const accessToken = (await resp.json()).token;

        await Promise.all(
            divisions.map(async (divisionId) => {
                const wods = workouts.find(
                    (wod) => wod.division === divisionId
                )?.ids;
                wods?.map(async (id) =>
                    resetScores(
                        id.toString(),
                        EVENT_ID.toString(),
                        accessToken,
                        divisionId.toString()
                    )
                );
            })
        );

        const athletes = await Promise.all(
            divisions.map(async (divisionId) =>
                getAthletes(
                    EVENT_ID.toString(),
                    divisionId.toString(),
                    accessToken
                ).then((athletes) =>
                    athletes.map((athlete) => ({
                        id: athlete.participantId,
                        name: athlete.fullName,
                        divisionId: athlete.athleteDivisionId,
                    }))
                )
            )
        );

        const athletesWithScores = athletes.flat().map((athlete) => {
            const score1 = generateScore(true);
            const score2 = score1 === "WD" ? "WD" : generateScore();
            const score3 = score2 === "WD" ? "WD" : generateScore();
            const score4 = score3 === "WD" ? "WD" : generateScore();
            return { ...athlete, scores: [score1, score2, score3, score4] };
        });

        for (let divisionId of divisions) {
            const wods = workouts.find(
                (wod) => wod.division === divisionId
            )?.ids;
            if (!wods) return;
            let index = 0;
            for (let wod of wods) {
                const athletesWithScoresForDivision = athletesWithScores
                    .filter((athlete) => athlete.divisionId === divisionId)
                    .map((athlete) => {
                        switch (true) {
                            case index < 2:
                                return {
                                    score: athlete.scores[index],
                                    id: athlete.id,
                                };
                            case index >= 2:
                                return {
                                    score:
                                        athlete.scores[index] === "WD"
                                            ? "WD"
                                            : "0",
                                    tiebreakerScore:
                                        athlete.scores[index] === "WD"
                                            ? null
                                            : athlete.scores[index],
                                    id: athlete.id,
                                };
                        }
                    });

                await fetch(
                    `${BASE_URL}/results/event/${EVENT_ID}/workout/${wod}?forcedUpdate=true`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(athletesWithScoresForDivision),
                    }
                );
                index++;
            }
        }

        return res.status(200).end();
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ valid: "ko", error: err.message });
        return;
    }
}
