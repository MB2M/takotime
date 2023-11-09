import { z } from "zod";

export const EventMessageSchema = z.union([
    z.object({ id: z.string().optional() }).catchall(z.record(z.any())),
    z.string(),
]);

type EventMessage = z.infer<typeof EventMessageSchema>;
