import admin from "./adminConfig";

export async function updateFirebase(payload: any, cb: Function) {
    console.log("PAYLAOD", payload.rounds[0].heats[0].results[0].participant);
    const db = admin.database().ref();
    const tryRef = db.child("try");
    await tryRef.set(
        payload.rounds[0].heats[0].results[0].participant,
        (error: any) => {
            cb(error);
        }
    );
}
