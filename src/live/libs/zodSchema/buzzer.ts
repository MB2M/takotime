import { z } from "zod";

export const baseMessageSchema = z.object({ id: z.string() });

export const buzzMessageSchema = baseMessageSchema.merge(
    z.object({
        timestamp: z.number(),
    })
);

type BuzzMessage = z.infer<typeof buzzMessageSchema>;
