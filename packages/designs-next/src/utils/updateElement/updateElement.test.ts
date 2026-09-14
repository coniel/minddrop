import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { updateElement } from './updateElement';

const { bodyDesignElement, captionSlotElement, slottedDesignElement } =
  DesignElementFixtures;

const elements = [bodyDesignElement, slottedDesignElement, captionSlotElement];

describe('updateElement', () => {
  it('applies the changes to the element', () => {
    const updated = updateElement(elements, captionSlotElement.id, {
      property: 'Title',
    });

    expect(updated[2]).toEqual({ ...captionSlotElement, property: 'Title' });
  });

  it('leaves the other elements untouched', () => {
    const updated = updateElement(elements, captionSlotElement.id, {
      property: 'Title',
    });

    expect(updated[0]).toBe(bodyDesignElement);
    expect(updated[1]).toBe(slottedDesignElement);
  });

  it('returns the elements unchanged when the design has no such element', () => {
    const updated = updateElement(elements, 'element_missing', {
      property: 'Title',
    });

    expect(updated).toEqual(elements);
  });
});
