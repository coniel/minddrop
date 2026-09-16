import { PaddingSizes } from '../../constants';
import { PaddingSize } from '../../types';

/**
 * Resolves the scale step matching a padding amount.
 *
 * @param amount - The padding amount in pixels.
 * @returns The step, or undefined if the amount is not on the scale.
 */
export function resolvePaddingSize(amount: number): PaddingSize | undefined {
  const sizes = Object.keys(PaddingSizes) as PaddingSize[];

  return sizes.find((size) => PaddingSizes[size] === amount);
}
