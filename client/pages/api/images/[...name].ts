import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const slug = req.query.name as string[];
    const imagePath = slug.join("/");
    const filePath = path.resolve(".", `public/img/logo/${imagePath}`);
    const imageBuffer = fs.readFileSync(filePath);
    res.setHeader("Content-Type", "image/jpg");
    return res.send(imageBuffer);
}
