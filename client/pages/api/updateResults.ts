// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const BASE_URL = "https://competitioncorner.net/api2/v1";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, workoutId, payload } = JSON.parse(req.body);
    const { token } = req.query;
    // try {
    // const response = await fetch(BASE_LOGIN_URL, {
    //     method: "POST",
    //     body: JSON.stringify({
    //         username: process.env.CC_LOGIN,
    //         password: process.env.CC_PASSWORD,
    //     }),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });

    // if (response.ok) {
    // const { access_token: accessToken } = await response.json();
    try {
        if (!token) throw new Error("token is missing");

        const decoded: any = jwt.verify(
            token as string,
            process.env.JWT_SECRET as string
        );
        const accessToken = decoded.CCAccessToken;

        const response = await fetch(
            `${BASE_URL}//results/event/${eventId}/workout/${workoutId}?forcedUpdate=true`,
            {
                method: "POST",
                headers: { Authorization: "Bearer " + accessToken }, //TODO
                body: JSON.stringify({ payload }),
            }
        );
        if (response.ok) {
            const json = await response.json();
            res.status(200).json(json);
            return;
        } else {
            throw new Error("bad request");
        }
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ valid: "ko", error: err.message });
        return;
    }
}
