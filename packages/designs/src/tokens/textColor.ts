/**
 * The text colour steps, in display order. Colour always follows
 * the entry's colour: `subtle` is a faded near-black version,
 * `regular` the near-black version itself, and `solid` the colour
 * at full strength. Without an entry colour every step resolves to
 * greys.
 */
export const TextColorTokens = ['subtle', 'regular', 'solid'] as const;

export type TextColorToken = (typeof TextColorTokens)[number];
