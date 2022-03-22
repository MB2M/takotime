import Keyv from "keyv";

const keyv = new Keyv(process.env.KEYV_MONGO_URL);

keyv.on("error", (err) => console.log("Connection Error", err));

export default keyv;
