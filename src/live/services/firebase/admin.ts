import { getDatabase } from "firebase-admin/database";
// Import the functions you need from the SDKs you need
import admin from "firebase-admin";

const getServiceAccount = () => {
    // const env = process.env.NEXT_PUBLIC_FIREBASE_ENV;

    return {
        projectId: process.env[`FIREBASE_TAKO_RESULT_PROJECT_ID`],
        clientEmail: process.env[`FIREBASE_TAKO_RESULT_CLIENT_EMAIL`],
        privateKey: process.env[`FIREBASE_TAKO_RESULT_PRIVATE_KEY`]?.replace(
            /\\n/g,
            "\n"
        ),
    };
};

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(getServiceAccount() as any),
            databaseURL: process.env.FIREBASE_TAKO_RESULT_DB,
        });
    } catch (error) {
        console.log("Firebase admin initialization error", error);
    }
}

export default getDatabase();
// export const auth = admin.auth();
