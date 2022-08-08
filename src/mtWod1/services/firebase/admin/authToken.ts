import admin from "./adminConfig";

export const getAuthToken = async (userAddress: string) => {
    return await admin.auth().createCustomToken(userAddress, { role: "admin" });
};
