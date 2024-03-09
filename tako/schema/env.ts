import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.string().default("development"),
    AUTH_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;
