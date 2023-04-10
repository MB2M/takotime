export function cumulativeTable(table: number[]) {
    const cumulativeSum = (
        (sum: number) => (value: number) =>
            (sum += value)
    )(0);
    return table.map(cumulativeSum);
}
