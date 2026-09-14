import { describe, expect, it } from 'vitest';
import { DesignElementFixtures, ElementConfigFixtures } from '../../test-utils';
import { resolveSlotElement } from './resolveSlotElement';

const { bodyDesignElement, captionSlotElement, slottedDesignElement } =
  DesignElementFixtures;
const { TestSlotName } = ElementConfigFixtures;

const elements = [bodyDesignElement, slottedDesignElement, captionSlotElement];

describe('resolveSlotElement', () => {
  it('returns the element filling the slot', () => {
    expect(
      resolveSlotElement(elements, slottedDesignElement.id, TestSlotName),
    ).toBe(captionSlotElement);
  });

  it('returns nothing for an empty slot', () => {
    expect(
      resolveSlotElement(elements, bodyDesignElement.id, TestSlotName),
    ).toBeUndefined();
  });

  it('returns nothing for a slot of another name', () => {
    expect(
      resolveSlotElement(elements, slottedDesignElement.id, 'footer'),
    ).toBeUndefined();
  });
});
