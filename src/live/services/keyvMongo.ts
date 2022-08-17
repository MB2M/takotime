import Keyv from "keyv";

const loadWithMongoSave = () => {
    const keyv = new Keyv(process.env.KEYV_MONGO_URL);
    keyv.on("error", (err) => console.log("Connection Error", err));
    return keyv;
};

export default loadWithMongoSave;
