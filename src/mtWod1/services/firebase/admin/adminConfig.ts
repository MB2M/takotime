// Import the functions you need from the SDKs you need
import admin from "firebase-admin";

import serviceAccount from "./firebase-credentials.json" assert { type: "json" };
// const serviceAccount = require(`../../../../../${process.env.FIREBASE_CREDENTIAL}.json`);

// REALTIME DB
// FIRESTORE
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
            // databaseURL: process.env.FIREBASE_DB, // ONLY REALTIME DB
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
