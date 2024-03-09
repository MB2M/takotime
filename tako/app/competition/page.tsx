import { prisma } from "@/db";
import AddButton from "@/components/AddButton";
import AddCompetitionForm from "@/app/competition/add-competiton-form";

const competitionPage = async () => {
    const competition = await prisma.competition.findMany({ take: 10 });

    return (
        <div>
            <div className={"p-12"}>
                <div className={"text-center text-4xl my-8"}>
                    Add a competition
                </div>
                {/*<AddButton text={"Create a new competition"} />*/}
                <AddCompetitionForm />
            </div>
            <div className={"text-center text-4xl"}>Pick a competition</div>
            {competition.map((competition) => (
                <div key={competition.id}>
                    <h1>{competition.name}</h1>
                </div>
            ))}
        </div>
    );
};

export default competitionPage;
