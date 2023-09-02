export const getTopScore = (
    length: number,
    category: string,
    results: CCSimpleResult[]
) => {
    // console.log(
    //     results.filter(
    //         (result) => result.division === category && result.scores
    //     )
    // );

    const rest = results
        .filter((result) => result.division === category && result.scores[0])
        ?.sort((a, b) => {
            const scoreA =
                a?.scores[0]
                    .replace("reps", "")
                    .replace(" ", "")
                    .replace("kg", "") || "0";
            const scoreB =
                b?.scores[0]
                    .replace("reps", "")
                    .replace(" ", "")
                    .replace("kg", "") || "0";

            if (scoreA.includes("WD") || scoreA === "0") return 1;
            if (scoreB.includes("WD") || scoreB === "0") return -1;
            if (scoreA.includes("Cap+") && scoreB.includes("Cap+"))
                return (
                    +scoreB.replaceAll("Cap+ ", "") -
                    +scoreA.replaceAll("Cap+", "")
                );

            if (scoreA.includes("Cap+") && !scoreB.includes("Cap+")) return 1;
            if (!scoreA.includes("Cap+") && scoreB.includes("Cap+")) return -1;

            //FOR TIME
            if (scoreA.includes(":"))
                return +scoreA.replace(":", "") - +scoreB.replace(":", "");

            //AMRAP
            // console.log(scoreA, scoreB);
            return +scoreB - +scoreA;
        })
        .slice(0, length);
    // console.log(rest);
    return rest;
};
