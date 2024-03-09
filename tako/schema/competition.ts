import { z } from "zod";
import { rankingPlatforms } from "@/lib/rankingPlatform";

const rankingPlatformValueSchema = z.enum(["CompetitionCorner", "ScoringFit"]);
export type RankingPlatformValue = z.infer<typeof rankingPlatformValueSchema>;

export const competitionSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters long"),
    rankingPlatform: rankingPlatformValueSchema,
    externalId: z.string(),
});
