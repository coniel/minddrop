import { describe, expect, it } from 'vitest';
import {
  blockElements,
  bodyElement,
  coverElement,
  iconElement,
  titleElement,
} from '../../test-utils';
import { resolveContextElements } from './resolveContextElements';

describe('resolveContextElements', () => {
  it('returns side-by-side neighbours', () => {
    expect(resolveContextElements(titleElement, blockElements)).toEqual([
      iconElement,
    ]);
  });

  it('is symmetric between neighbours', () => {
    expect(resolveContextElements(iconElement, blockElements)).toEqual([
      titleElement,
    ]);
  });

  it('excludes layered elements', () => {
    // The cover overlaps the title and icon on both axes
    expect(resolveContextElements(coverElement, blockElements)).toEqual([]);
  });

  it('excludes elements in disjoint rows', () => {
    expect(resolveContextElements(bodyElement, blockElements)).toEqual([]);
  });

  it('excludes the element itself', () => {
    expect(resolveContextElements(titleElement, [titleElement])).toEqual([]);
  });
});
