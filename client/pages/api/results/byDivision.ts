// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getBackendUrl } from "../../../utils/requestHost";

const BASE_URL = "https://competitioncorner.net/api2/v1";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, divisionId, workoutId } = req.query;

    try {
        const resp = await fetch(
            `http://${getBackendUrl(req)}/live/api/cc-token`
        );
        const accessToken = (await resp.json()).token;

        const response = await fetch(
            `${BASE_URL}/events/${eventId}/onsite/scores-editor?workoutId=${workoutId}&divisionId=${divisionId}`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const json = await response.json();
            return res.status(200).json(json.participants);
        } else {
            throw new Error(await response.text());
        }
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ valid: "ko", error: err.message });
        return;
    }
}
