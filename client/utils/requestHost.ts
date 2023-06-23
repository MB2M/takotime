import { NextApiRequest } from "next";

const getRequestHost = (req: NextApiRequest) => {
    return req.headers.host?.split(":")[0];
};

export const getBackendUrl = (req: NextApiRequest) => {
    return `${getRequestHost(req)}:3000`;
};
