import { describe, expect, it } from 'vitest';
import { AddContentDataKey } from '@minddrop/ui-databases';
import { hasTransferredAddContentCard } from './hasTransferredAddContentCard';

describe('hasTransferredAddContentCard', () => {
  it('returns true when the data contains an add content card', () => {
    expect(hasTransferredAddContentCard({ [AddContentDataKey]: true })).toBe(
      true,
    );
  });

  it('returns false when the data contains no add content card', () => {
    expect(hasTransferredAddContentCard({ 'text/plain': 'Hello world' })).toBe(
      false,
    );
  });
});
