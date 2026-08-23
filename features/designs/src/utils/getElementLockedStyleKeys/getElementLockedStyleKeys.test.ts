import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../../test-utils';
import { FlatPropertyElement, FlatTextElement } from '../../types';
import { getElementLockedStyleKeys } from './getElementLockedStyleKeys';

const { element_text_1, element_property_text_1 } = DesignFixtures;

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

describe('getElementLockedStyleKeys', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('locks nothing on an element without a role', () => {
    expect(getElementLockedStyleKeys(flatTextElement, 'card').size).toBe(0);
  });

  it('locks nothing when the role is not registered', () => {
    // Reference a role which was never registered
    const element = { ...flatTextElement, role: 'not-a-registered-role' };

    expect(getElementLockedStyleKeys(element, 'card').size).toBe(0);
  });

  it("locks the role's context-resolved style keys", () => {
    // The subtitle role locks styles and offers no variant axes
    const element = { ...flatTextElement, role: 'subtitle' };

    const lockedKeys = getElementLockedStyleKeys(element, 'card');

    // The role's context-independent locked keys
    expect(lockedKeys.has('color')).toBe(true);
    expect(lockedKeys.has('lineHeight')).toBe(true);

    // The card context's keys
    expect(lockedKeys.has('fontSize')).toBe(true);
  });

  it('locks keys per layout context', () => {
    const element = { ...flatTextElement, role: 'title' };

    // Titles truncate on list rows only
    expect(getElementLockedStyleKeys(element, 'list').has('truncate')).toBe(
      true,
    );
    expect(getElementLockedStyleKeys(element, 'card').has('truncate')).toBe(
      false,
    );
  });

  it("locks the keys of the selected variant option alongside the role's own", () => {
    // The title role locks styles and offers a size axis
    const element = {
      ...flatTextElement,
      role: 'title',
      roleVariants: { size: 'lg' },
    };

    const lockedKeys = getElementLockedStyleKeys(element, 'card');

    // The role's own locked keys
    expect(lockedKeys.has('fontWeight')).toBe(true);
    expect(lockedKeys.has('lineHeight')).toBe(true);
    expect(lockedKeys.has('color')).toBe(true);

    // The key the selected size option sets
    expect(lockedKeys.has('fontSize')).toBe(true);
  });

  it('locks the default option keys when the element selects no variant', () => {
    // No roleVariants at all, so the axis default applies
    const element = { ...flatTextElement, role: 'title' };

    // The default size option sets the font size
    expect(getElementLockedStyleKeys(element, 'card').has('fontSize')).toBe(
      true,
    );
  });

  it('falls back to the default option when the selection is unknown', () => {
    // Select an option which does not exist on the size axis
    const element = {
      ...flatTextElement,
      role: 'title',
      roleVariants: { size: 'not-an-option' },
    };

    // The default option's key is still locked
    expect(getElementLockedStyleKeys(element, 'card').has('fontSize')).toBe(
      true,
    );
  });

  it('leaves keys the role does not control unlocked', () => {
    const element = { ...flatTextElement, role: 'title' };

    const lockedKeys = getElementLockedStyleKeys(element, 'card');

    // The title role controls neither alignment nor margins
    expect(lockedKeys.has('textAlign')).toBe(false);
    expect(lockedKeys.has('marginTop')).toBe(false);
  });

  it("locks a property element's variant theme keys", () => {
    // The font size and line height are outside the whitelist;
    // truncation is whitelisted, so it stays an overridable
    // default rather than a lock
    expect(getElementLockedStyleKeys(flatPropertyElement, 'card')).toEqual(
      new Set(['fontSize', 'lineHeight']),
    );
  });

  it('locks the selected presentation variant keys', () => {
    const element = {
      ...flatPropertyElement,
      variant: 'subtitle',
    };

    const lockedKeys = getElementLockedStyleKeys(element, 'card');

    // The subtitle variant's theme styles
    expect(lockedKeys.has('lineHeight')).toBe(true);
    expect(lockedKeys.has('fontSize')).toBe(true);

    // Colour is never variant-controlled
    expect(lockedKeys.has('color')).toBe(false);
  });
});
