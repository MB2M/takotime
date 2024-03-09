"use server";

import { competitionSchema } from "@/schema/competition";
import { revalidatePath } from "next/cache";
import { createCompetition } from "@/lib/services/competitions.services";
import { withSessionUser } from "@/utils/withSession";

export const addCompetitionAction = async (
    prevState: {
        message: string;
    },
    formData: FormData
) => {
    const rawFormData = {
        name: formData.get("name"),
        externalId: formData.get("externalId"),
        rankingPlatform: formData.get("rankingPlatform"),
    };

    const parse = competitionSchema.safeParse(rawFormData);
    if (!parse.success) {
        console.log(parse.error);
        return {
            message: parse.error.message,
        };
    }

    await withSessionUser((user) =>
        createCompetition(parse.data.name, parse.data.externalId, user.id!)
    );

    revalidatePath("/competition");

    return { message: "sdfaasdfasdfasdfasdfadfs" };
};
