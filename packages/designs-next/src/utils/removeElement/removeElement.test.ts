import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { DesignElement } from '../../types';
import { removeElement } from './removeElement';

const { bodyDesignElement, captionSlotElement, slottedDesignElement } =
  DesignElementFixtures;

const elements = [bodyDesignElement, slottedDesignElement, captionSlotElement];

// A caption of the caption, two generations below the body
const nestedElement: DesignElement = {
  ...captionSlotElement,
  id: 'element_nested',
  parent: captionSlotElement.id,
};

describe('removeElement', () => {
  it('removes the element', () => {
    const remaining = removeElement(elements, bodyDesignElement.id);

    expect(remaining).toEqual([slottedDesignElement, captionSlotElement]);
  });

  it('removes the elements it holds along with it', () => {
    const remaining = removeElement(elements, slottedDesignElement.id);

    expect(remaining).toEqual([bodyDesignElement]);
  });

  it('removes them however deeply they are held', () => {
    const remaining = removeElement(
      [...elements, nestedElement],
      slottedDesignElement.id,
    );

    expect(remaining).toEqual([bodyDesignElement]);
  });

  it('leaves the element holding it in place', () => {
    const remaining = removeElement(elements, captionSlotElement.id);

    expect(remaining).toEqual([bodyDesignElement, slottedDesignElement]);
  });

  it('returns the elements unchanged when the design has no such element', () => {
    expect(removeElement(elements, 'element_missing')).toEqual(elements);
  });
});
