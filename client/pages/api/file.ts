import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import crypto from "crypto";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(404).send("Bad Method");
    }

    const { _id, dark } = req.query;

    if (!_id) {
        return res.status(404).send("_id is missing");
    }

    const asyncParse = (req: NextApiRequest) =>
        new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

    const saveFile = async (file: formidable.File) => {
        const data = fs.readFileSync(file.filepath);
        const extension = file.originalFilename?.split(".").at(-1);
        const fileName = crypto.randomBytes(20).toString("hex");
        fs.writeFileSync(`./public/img/${fileName}.${extension}`, data);
        fs.unlinkSync(file.filepath);

        await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition/${_id}`,
            {
                method: "PUT",
                body: JSON.stringify({ logoUrl: `${fileName}.${extension}` }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return;
    };

    const result = (await asyncParse(req)) as {
        fields: formidable.Fields;
        files: formidable.Files;
    };
    await saveFile(result.files.file as formidable.File);

    return res.status(201).send("");

    // form.parse(req, async function (err, fields, files) {
    //     await saveFile(files.file as formidable.File);
    //     return res.status(201).send("");
    // });
}
