type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never;

type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
