// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sender } from "../../utils/backendEvent/sender";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body;
    sender(data);
    res.status(200).json({ name: "John Doe" });
}
