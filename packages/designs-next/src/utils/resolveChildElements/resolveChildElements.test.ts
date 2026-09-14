import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { resolveChildElements } from './resolveChildElements';

const { bodyDesignElement, captionSlotElement, slottedDesignElement } =
  DesignElementFixtures;

const elements = [bodyDesignElement, slottedDesignElement, captionSlotElement];

describe('resolveChildElements', () => {
  it('returns the elements a parent holds', () => {
    expect(resolveChildElements(elements, slottedDesignElement.id)).toEqual([
      captionSlotElement,
    ]);
  });

  it("returns the design's own elements without a parent", () => {
    expect(resolveChildElements(elements)).toEqual([
      bodyDesignElement,
      slottedDesignElement,
    ]);
  });

  it('returns nothing for a parent holding none', () => {
    expect(resolveChildElements(elements, bodyDesignElement.id)).toEqual([]);
  });
});
