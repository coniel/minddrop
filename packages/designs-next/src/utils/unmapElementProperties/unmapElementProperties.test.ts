import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { DesignElement } from '../../types';
import { unmapElementProperties } from './unmapElementProperties';

const { titleDesignElement, slottedDesignElement, captionSlotElement } =
  DesignElementFixtures;

// Maps to the property being unmapped
const mappedElement: DesignElement = {
  ...titleDesignElement,
  property: 'Title',
};

// Maps to another property
const otherMappedElement: DesignElement = {
  ...slottedDesignElement,
  property: 'Notes',
};

// Maps to the unmapped property from inside its parent's slot
const mappedSlotElement: DesignElement = {
  ...captionSlotElement,
  property: 'Title',
};

const elements = [mappedElement, otherMappedElement, mappedSlotElement];

describe('unmapElementProperties', () => {
  it('clears the mapping from the elements', () => {
    const unmapped = unmapElementProperties(elements, 'Title');

    expect(unmapped[0]).not.toHaveProperty('property');
  });

  it('clears it from slot children along with the rest', () => {
    const unmapped = unmapElementProperties(elements, 'Title');

    expect(unmapped[2]).not.toHaveProperty('property');
  });

  it('leaves elements mapping another property alone', () => {
    const unmapped = unmapElementProperties(elements, 'Title');

    expect(unmapped[1].property).toBe('Notes');
  });

  it("leaves the element's own content in place", () => {
    const unmapped = unmapElementProperties(
      [{ ...mappedElement, content: 'Static' }],
      'Title',
    );

    expect(unmapped[0].content).toBe('Static');
  });

  it('returns the given elements when none maps the property', () => {
    const unaffected = [otherMappedElement, titleDesignElement];

    expect(unmapElementProperties(unaffected, 'Title')).toBe(unaffected);
  });
});
