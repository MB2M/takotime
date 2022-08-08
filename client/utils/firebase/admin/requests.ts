import admin from "./adminConfig";

export async function updateFirebase(payload: any, cb: Function) {
    const db = admin.database().ref();
    const tryRef = db.child(payload._id)
    await tryRef.update(payload, (error: any) => {
        cb(error);
    });
}
