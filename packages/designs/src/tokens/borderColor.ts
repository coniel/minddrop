/**
 * The border color roles: the schemable weights plus the fixed
 * brand and intent outlines. Hover and selection borders are not
 * design vocabulary.
 */
export const BorderColorTokens = [
  'subtle',
  'default',
  'strong',
  'primary-subtle',
  'primary',
  'danger-subtle',
  'danger',
  'warning-subtle',
  'warning',
  'info-subtle',
  'info',
  'success-subtle',
  'success',
] as const;

export type BorderColorToken = (typeof BorderColorTokens)[number];
