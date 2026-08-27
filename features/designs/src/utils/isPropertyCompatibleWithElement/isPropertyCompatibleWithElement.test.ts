import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../../test-utils';
import { isPropertyCompatibleWithElement } from './isPropertyCompatibleWithElement';

const { element_text_1, element_container_1, element_property_collection_1 } =
  DesignFixtures;

describe('isPropertyCompatibleWithElement', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns false for static elements', () => {
    const staticElement = { ...element_text_1, static: true };

    expect(isPropertyCompatibleWithElement('text', staticElement)).toBe(false);
  });

  it('returns false when the element type cannot render the property type', () => {
    // Text elements render text-like properties, not numbers
    expect(isPropertyCompatibleWithElement('number', element_text_1)).toBe(
      false,
    );
  });

  it('returns true when the element type can render the property type', () => {
    expect(isPropertyCompatibleWithElement('text', element_text_1)).toBe(true);
  });

  it('returns true for image properties on containers', () => {
    // Containers render an image property as their background
    expect(isPropertyCompatibleWithElement('image', element_container_1)).toBe(
      true,
    );
  });

  it('resolves property element compatibility from its config', () => {
    // Collection elements bind collection properties only
    expect(
      isPropertyCompatibleWithElement(
        'collection',
        element_property_collection_1,
      ),
    ).toBe(true);
    expect(
      isPropertyCompatibleWithElement('text', element_property_collection_1),
    ).toBe(false);
  });
});
