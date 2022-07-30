// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://competitioncorner.net/api2/v1/users/login";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                loginUsername: process.env.CC_LOGIN,
                loginPassword: process.env.CC_PASSWORD,
                returnUrl: "https://competitioncorner.net/dashboard",
                role: "Organizer",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const json = await response.json();
            console.log(json)
            res.status(200).json(json);
        } else {
            res.status(400).send("bad request");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("bad request");
        return;
    }
}
