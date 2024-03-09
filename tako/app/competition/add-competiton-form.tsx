"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addCompetitionAction } from "@/actions/competition";
import { CompetitionInfo, rankingPlatforms } from "@/lib/rankingPlatform";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import { getCompetitionInfoAction } from "@/actions/rankingPlatform";
import { RankingPlatformValue } from "@/schema/competition";

const initialState = {
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            aria-disabled={pending}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
            focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600
            dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Add
        </button>
    );
}

const AddCompetitionForm = () => {
    const [formState, formAction] = useFormState(
        addCompetitionAction,
        initialState
    );
    const [debouncedId, setDebouncedId] = useDebounceValue("", 1000);
    const [platform, setPlatform] =
        useState<RankingPlatformValue>("CompetitionCorner");
    const [competitionInfo, setCompetitionInfo] = useState<CompetitionInfo>();

    useEffect(() => {
        console.log(debouncedId);
        (async () => {
            const response = await getCompetitionInfoAction(
                debouncedId,
                platform
            );
            console.log(response);
            if (response.success) {
                setCompetitionInfo(response.data);
            } else {
                setCompetitionInfo(undefined);
            }
        })();
    }, [debouncedId, platform]);

    return (
        <form className="max-w-sm mx-auto" action={formAction}>
            <div className="mb-5">
                <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
            block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            <div className="mb-5">
                <label
                    htmlFor="platform"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Ranking platform
                </label>
                <select
                    id="platform"
                    name="rankingPlatform"
                    onChange={(e) =>
                        setPlatform(e.target.value as RankingPlatformValue)
                    }
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
            block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {rankingPlatforms.map((platform) => (
                        <option value={platform.value} key={platform.name}>
                            {platform.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-5">
                <label
                    htmlFor="competitionId"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Competition id
                </label>
                <input
                    type="text"
                    id="competitionId"
                    name="externalId"
                    required
                    onChange={(e) => setDebouncedId(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
            block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p>{competitionInfo?.name}</p>
            </div>
            <div className="mb-5">
                <SubmitButton />
                <p aria-live="polite" className="sr-only" role="status">
                    {formState?.message}
                </p>
            </div>
        </form>
    );
};

export default AddCompetitionForm;
