"use server";

import { RankingPlatformValue } from "@/schema/competition";
import { CompetitionInfo, getRankingPlatform } from "@/lib/rankingPlatform";

export const getCompetitionInfoAction = async (
    id: string,
    platformValue: RankingPlatformValue
): Promise<
    | { success: true; data: CompetitionInfo }
    | { success: false; message: string }
> => {
    console.log(id, platformValue);

    const rankingPlatform = getRankingPlatform(platformValue);

    if (!rankingPlatform) {
        return { success: false, message: "Invalid ranking platform" };
    }

    try {
        const competitionInfo = await rankingPlatform.getCompetitionInfo(id);
        return { success: true, data: competitionInfo };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
