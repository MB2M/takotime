export const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return "";

    return [...countryCode.toUpperCase()]
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .reduce((a, b) => `${a}${b}`);
};
