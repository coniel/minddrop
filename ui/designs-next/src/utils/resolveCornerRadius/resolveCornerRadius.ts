import { ElementCornerRadius } from '@minddrop/designs-next';

// The theme's radius token for each corner radius
const CornerRadiusValues: Record<ElementCornerRadius, string> = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
};

/**
 * Resolves a corner radius to the CSS border radius it renders as.
 *
 * @param radius - The corner radius.
 * @returns The border radius.
 */
export function resolveCornerRadius(radius: ElementCornerRadius): string {
  return CornerRadiusValues[radius];
}
