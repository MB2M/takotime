// Import the functions you need from the SDKs you need
import admin from "firebase-admin";

import serviceAccount from "./firebase-credentials.json";
// const serviceAccount = require(`../../../../../${process.env.FIREBASE_CREDENTIAL}.json`);

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
            databaseURL: process.env.FIREBASE_DB,
            databaseAuthVariableOverride: {
                uid: "exos-server",
            },
        });
    } catch (error) {
        console.log("Firebase admin initialization error", error);
    }
}
// const initAdminApp = (apiKey: string) => {

//     admin.initializeApp(
//         {
//             credential: admin.credential.cert(serviceAccount as any),
//             databaseURL: process.env.FIREBASE_DB,
//             databaseAuthVariableOverride: {
//                 apiKey: apiKey,
//             },
//         },
//         apiKey
//     );
//     return admin;
// };

export default admin;
