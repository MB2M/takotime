// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const BASE_URL = "https://competitioncorner.net/api2/v1/";
const BASE_LOGIN_URL = "https://competitioncorner.net/api2/v1/accounts/login";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, workoutId } = JSON.parse(req.body);
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
    if (!token) return;

    const decoded: any = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
    );
    const accessToken = decoded.CCAccessToken;

    try {
        const response = await fetch(
            `${BASE_URL}events/${eventId}/workouts/${workoutId}/eligible-participants`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken }, //TODO
            }
        );
        if (response.ok) {
            const json = await response.json();
            res.status(200).json(json);
            return;
        } else {
            res.status(400).send("Bad request");
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("bad request");
        return;
    }
    // } else {
    //     res.status(400).send("bad request");
    //     return
    // }
    // } catch (err) {
    //     console.log(err);
    //     res.status(400).send("bad request");
    //     return;
    // }

    // try {
    //     const response = await fetch(
    //         `${BASE_URL}${eventId}/workouts/${workoutId}/eligible-participants`,
    //         {
    //             method: "GET",
    //             headers: { Authorization: "Bearer " + access_token.value }, //TODO
    //         }
    //     );

    //     if (response.ok) {
    //         const json = await response.json();
    //         res.status(200).json(json);
    //     }
    // } catch (err) {
    //     console.log(err);
    // }
    res.status(400).json({ name: "John Doe" });
}
