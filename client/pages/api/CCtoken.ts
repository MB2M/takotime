// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const BASE_URL = "https://competitioncorner.net/api2/v1/accounts/login";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                username: process.env.CC_LOGIN,
                password: process.env.CC_PASSWORD,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const { access_token } = await response.json();
            const token = jwt.sign(
                { CCAccessToken: access_token },
                process.env.JWT_SECRET as string
            );
            res.status(200).send(token);
        } else {
            res.status(400).send("bad request");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("bad request");
        return;
    }
}
