const getRequestHost = (req: { headers: { host?: string } }) => {
    return req.headers.host?.split(":")[0];
};

export const getBackendUrl = (req: { headers: { host?: string } }) => {
    if (!req.headers.host) throw new Error("No request provided");
    return `${getRequestHost(req)}:3000`;
};
