type Competition = {
    _id: string;
    name: string;
    state: "active" | "inactive";
    platform: "CompetitionCorner";
    eventId: string;
    selected: boolean;
    logoUrl?: string;
    logoDarkUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
};

type Platform = "CompetitionCorner";


