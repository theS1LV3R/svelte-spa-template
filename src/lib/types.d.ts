export type roleCheckModes = 'exact' | 'either' | 'none';

export type BetterOmit<T, Key extends keyof T> = { [P in Exclude<keyof T, Key>]: T[P] };
