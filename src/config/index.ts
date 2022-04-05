import * as dotenv from "dotenv";
dotenv.config();

export default {
    serverPort: process.env.SERVER_PORT,
    tokenSecret: process.env.TOKEN_SECRET,
    brokerUri: process.env.BROKER_URI,
    brokerPort: process.env.BROKER_PORT,
    brokerPassword: process.env.BROKER_PASSWORD,
    brokerUsername: process.env.BROKER_USERNAME,
    mongopAedesUrl: process.env.MONGO_AEDES_URL,
    mongoKeyvUrl: process.env.KEYV_MONGO_URL,
    corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
    mqttUrl: process.env.MQTT_URL,
};
