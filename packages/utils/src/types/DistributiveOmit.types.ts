/**
 * Omit applied to each member of a union rather than to the union as
 * a whole, which would collapse it to the keys its members share and
 * lose the field they are discriminated by.
 */
export type DistributiveOmit<
  TType,
  TKeys extends keyof never,
> = TType extends unknown ? Omit<TType, TKeys> : never;
