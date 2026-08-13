/**
 * The text color roles: the schemable hierarchy (`regular` to
 * `subtle`), `on-solid` for text over solid fills, and the fixed
 * brand and intent roles. State roles (placeholder, disabled) are
 * not design vocabulary.
 */
export const TextColorTokens = [
  'regular',
  'muted',
  'subtle',
  'on-solid',
  'primary',
  'danger',
  'warning',
  'info',
  'success',
] as const;

export type TextColorToken = (typeof TextColorTokens)[number];
