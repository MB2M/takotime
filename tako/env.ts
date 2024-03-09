import { Env, envSchema } from "@/schema/env";

const env: Env = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    AUTH_URL: process.env.AUTH_URL as string,
    AUTH_SECRET: process.env.AUTH_SECRET as string,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID as string,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET as string,
};

export default envSchema.parse(env);
