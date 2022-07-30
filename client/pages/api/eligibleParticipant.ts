// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { json } from "stream/consumers";

const BASE_URL =
    "https://competitioncorner.net/api2/v1/events/1989/workouts/11352/eligible-participants";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, workoutId } = req.query;

    try {
        const response = await fetch(
            `${BASE_URL}${eventId}/workouts/${workoutId}/eligible-participants`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + access_token.value }, //TODO
            }
        );

        if (response.ok) {
            const json = await response.json();
            res.status(200).json(json);
        }
    } catch (err) {
        console.log(err);
    }
    res.status(400).json({ name: "John Doe" });
}
