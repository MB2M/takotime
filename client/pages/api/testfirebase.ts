import { NextApiRequest, NextApiResponse } from "next";
import { updateFirebase } from "../../utils/firebase/admin/requests";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { payload } = JSON.parse(req.body);
    try {
        await updateFirebase(payload, (error: any) => {
            if (error) {
                res.status(400).send("Error occured updating payments data");
            } else {
                res.status(200).send("Payment updated");
            }
        });
    } catch (err) {
        res.status(400).send("Error occured updating payments data");
    }
}
