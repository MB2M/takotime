import jwt from "jsonwebtoken";

export interface ScorePost {
    id: number;
    score: string | number;
    secondaryScore: string | number | null;
    tiebreakerScore: string | number | null;
    isCapped: boolean;
    scaled: boolean;
    didNotFinish: boolean;
}

export let currentCCToken = "";

const BASE_URL = "https://competitioncorner.net/api2/v1/accounts/login";
const refreshAccessToken = async (): Promise<string> => {
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
            // const token = jwt.sign(
            //     { CCAccessToken: access_token },
            //     process.env.JWT_SECRET as string
            // );
            currentCCToken = access_token;

            return access_token;
        } else {
            currentCCToken = "";
            return "";
        }
    } catch (err) {
        console.log(err);
        currentCCToken = "";
        return "";
    }
};

const isExpired = (token: string) => {
    const payload = jwt.decode(token) as { exp: number };
    if (!payload?.exp) return true;
    return payload.exp < Date.now() / 1000;
};

export const getCCAccessToken = async () => {
    if (isExpired(currentCCToken)) {
        return await refreshAccessToken();
    }
    return currentCCToken;
};

export const postScore = async (
    eventId: number,
    workoutId: number,
    scorePayload: ScorePost[]
) => {
    const accessToken = await getCCAccessToken();
    console.log(JSON.stringify(scorePayload));
    console.log(
        `https://competitioncorner.net/api2/v1/results/event/${eventId}/workout/${workoutId}?forcedUpdate=true`
    );
    try {
        const response = await fetch(
            `https://competitioncorner.net/api2/v1/results/event/${eventId}/workout/${workoutId}?forcedUpdate=true`,
            {
                method: "POST",
                body: JSON.stringify(scorePayload),
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};
