import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { DesignElement } from '../../types';
import { remapElementProperties } from './remapElementProperties';

const { titleDesignElement, slottedDesignElement, captionSlotElement } =
  DesignElementFixtures;

// Maps to the property being remapped
const mappedElement: DesignElement = {
  ...titleDesignElement,
  property: 'Title',
};

// Maps to another property
const otherMappedElement: DesignElement = {
  ...slottedDesignElement,
  property: 'Notes',
};

// Maps to the remapped property from inside its parent's slot
const mappedSlotElement: DesignElement = {
  ...captionSlotElement,
  property: 'Title',
};

const elements = [mappedElement, otherMappedElement, mappedSlotElement];

describe('remapElementProperties', () => {
  it('maps the elements to the new property', () => {
    const remapped = remapElementProperties(elements, 'Title', 'Heading');

    expect(remapped[0].property).toBe('Heading');
  });

  it('maps slot children along with the rest', () => {
    const remapped = remapElementProperties(elements, 'Title', 'Heading');

    expect(remapped[2].property).toBe('Heading');
  });

  it('leaves elements mapping another property alone', () => {
    const remapped = remapElementProperties(elements, 'Title', 'Heading');

    expect(remapped[1].property).toBe('Notes');
  });

  it("leaves the element's own content in place", () => {
    const remapped = remapElementProperties(
      [{ ...mappedElement, content: 'Static' }],
      'Title',
      'Heading',
    );

    expect(remapped[0].content).toBe('Static');
  });

  it('returns the given elements when none maps the property', () => {
    const unaffected = [otherMappedElement, titleDesignElement];

    expect(remapElementProperties(unaffected, 'Title', 'Heading')).toBe(
      unaffected,
    );
  });
});
