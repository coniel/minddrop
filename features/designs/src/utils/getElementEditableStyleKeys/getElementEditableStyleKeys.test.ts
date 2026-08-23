import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../../test-utils';
import { FlatPropertyElement, FlatTextElement } from '../../types';
import { getElementEditableStyleKeys } from './getElementEditableStyleKeys';

const { element_text_1, element_property_text_1, element_property_number_1 } =
  DesignFixtures;

// A flat text element as the store holds it, used as the base for
// the role elements under test
const flatTextElement: FlatTextElement = {
  ...element_text_1,
  parent: 'root',
};

// A flat text property element as the store holds it
const flatPropertyElement: FlatPropertyElement = {
  ...element_property_text_1,
  parent: 'root',
};

describe('getElementEditableStyleKeys', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('restricts nothing on an element without a role', () => {
    expect(getElementEditableStyleKeys(flatTextElement)).toBeNull();
  });

  it('restricts nothing when the role is not registered', () => {
    const element = { ...flatTextElement, role: 'not-a-registered-role' };

    expect(getElementEditableStyleKeys(element)).toBeNull();
  });

  it("returns the role's editable style keys", () => {
    const element = { ...flatTextElement, role: 'title' };

    const keys = getElementEditableStyleKeys(element);

    // The title role offers alignment but reserves the font family
    // for the theme
    expect(keys).toContain('textAlign');
    expect(keys).not.toContain('fontFamily');
  });

  it("returns a property element variant's editable style keys", () => {
    const keys = getElementEditableStyleKeys(flatPropertyElement);

    // The plain text variant offers alignment but reserves the
    // font family for the theme
    expect(keys).toContain('textAlign');
    expect(keys).toContain('italic');
    expect(keys).not.toContain('fontFamily');
  });

  it('resolves editable keys per selected variant', () => {
    const element = {
      ...flatPropertyElement,
      variant: 'subtitle',
    };

    // Subtitles never render italic
    expect(getElementEditableStyleKeys(element)).not.toContain('italic');
  });

  it('restricts nothing on variants without an editable styles list', () => {
    const element: FlatPropertyElement = {
      ...element_property_number_1,
      parent: 'root',
    };

    expect(getElementEditableStyleKeys(element)).toBeNull();
  });
});
