import MqttBroker from "../utils/MqttBroker.ts";
import User from "../models/userSchema.js";
import LiveWodManager from "./utils/LiveWodManager.js";

declare global {
    var liveWodManager: LiveWodManager;
    namespace Express {
        interface Request {
            user: typeof User;
        }
    }
}

