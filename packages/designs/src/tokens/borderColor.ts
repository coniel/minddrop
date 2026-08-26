/**
 * The border colour roles: the schemable weights, which take on the
 * entry's colour inside a scheme and stay grey outside one. Pinned
 * neutral, brand and intent outlines are not design vocabulary.
 */
export const BorderColorTokens = ['subtle', 'default', 'strong'] as const;

export type BorderColorToken = (typeof BorderColorTokens)[number];
