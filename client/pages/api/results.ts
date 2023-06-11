// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://competitioncorner.net/api2/v1";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, workoutId } = JSON.parse(req.body);

    try {
        const resp = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/cc-token`
        );
        const accessToken = (await resp.json()).token;

        const response = await fetch(
            `${BASE_URL}/events/${eventId}/onsite/scores-editor?workoutId=${workoutId}`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken }, //TODO
            }
        );

        if (response.ok) {
            const json = await response.json();
            return res.status(200).json(json);
        } else {
            throw new Error("bad request");
        }
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ valid: "ko", error: err.message });
        return;
    }
}
