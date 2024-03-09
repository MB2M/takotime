import { prisma } from "@/db";

export const createCompetition = async (
    name: string,
    externalId: string,
    userId: string
) => {
    await prisma.competition.create({
        data: {
            name: name,
            externalId: externalId,
            user: { connect: { id: userId } },
        },
    });
};
