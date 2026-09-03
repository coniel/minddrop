import { describe, expect, it } from 'vitest';
import { BoxElementType } from '@minddrop/designs-next';
import { BoxElement } from '../BoxElement';
import { getElementRenderer } from './getElementRenderer';

describe('getElementRenderer', () => {
  it('returns the built-in box element renderer', () => {
    expect(getElementRenderer(BoxElementType)).toBe(BoxElement);
  });

  it('returns null for unregistered element types', () => {
    expect(getElementRenderer('unknown')).toBeNull();
  });
});
