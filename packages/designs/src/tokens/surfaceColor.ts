/**
 * The surface color roles: every non-interactive, non-state surface.
 * Solid fills pair with the `on-solid` text role. Hover/active and
 * state surfaces (skeleton, selected) are not design vocabulary.
 */
export const SurfaceColorTokens = [
  'app',
  'subtle',
  'raised',
  'overlay',
  'accent',
  'solid-accent',
  'neutral-subtle',
  'neutral',
  'solid-neutral',
  'primary-subtle',
  'primary',
  'solid-primary',
  'danger',
  'solid-danger',
  'warning',
  'solid-warning',
  'info',
  'solid-info',
  'success',
  'solid-success',
] as const;

export type SurfaceColorToken = (typeof SurfaceColorTokens)[number];
