import { RankingPlatformValue } from "@/schema/competition";
import { z } from "zod";

const CompetitionInfoSchema = z.object({
    name: z.string(),
});
export type CompetitionInfo = z.infer<typeof CompetitionInfoSchema>;

type RankingPlatform = {
    name: string;
    value: RankingPlatformValue;
    baseUrl: string;
    getCompetitionInfo: (competitionId: string) => Promise<CompetitionInfo>;
    fetchData: (uri: string) => Promise<any>;
};

const competitionCorner: RankingPlatform = {
    name: "CompetitionCorner",
    value: "CompetitionCorner",
    baseUrl: "https://competitioncorner.net/api2/v1",
    async fetchData(uri: string) {
        const response = await fetch(`${this.baseUrl}${uri}`);
        if (response.ok) {
            const json = await response.json();
            return CompetitionInfoSchema.parse(json);
        }
        throw new Error("Failed to fetch competition info");
    },
    async getCompetitionInfo(id: string) {
        const uri = `/events/${id}`;
        const response = await fetch(`${this.baseUrl}${uri}`, {
            headers: {
                userAgent: "",
            },
        });
        // console.log(response.statusText);
        if (response.ok) {
            const json = await response.json();
            return CompetitionInfoSchema.parse(json);
        }
        throw new Error("Failed to fetch competition info");
    },
};

const ScoringFit: RankingPlatform = {
    name: "ScoringFit",
    value: "ScoringFit",
    baseUrl: "https://scoring-rsnatch-prod.herokuapp.com/api",
    async getCompetitionInfo(id: string) {
        return {};
    },
};

export const rankingPlatforms: RankingPlatform[] = [
    competitionCorner,
    ScoringFit,
];

export const getRankingPlatform = (value: RankingPlatformValue) => {
    return rankingPlatforms.find((platform) => platform.value === value);
};
