import { z } from "zod";

export const classicAdapterConfigSchema = z.object({
    maxReps: z.number(),
    minReps: z.number(),
    startTime: z.number(),
    endTime: z.number(),
    buzzer: z.union([
        z.object({ active: z.literal(true), quantity: z.number().min(1) }),
        z.object({ active: z.literal(false) }),
    ]),
    split: z.boolean(),
});
