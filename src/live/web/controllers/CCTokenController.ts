import { Request, Response } from "express";
import { getCCAccessToken } from "../../services/CCTokenService";

export const getCCToken = async (req: Request, res: Response) => {
    const token = await getCCAccessToken();

    res.status(200).json({ token });
};
