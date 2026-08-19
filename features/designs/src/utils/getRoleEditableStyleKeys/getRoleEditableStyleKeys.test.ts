import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { cleanup, setup } from '../../test-utils';
import { FlatTextElement } from '../../types';
import { getRoleEditableStyleKeys } from './getRoleEditableStyleKeys';

const { element_text_1 } = DesignFixtures;

// A flat text element as the store holds it, used as the base for
// the role elements under test
const flatTextElement: FlatTextElement = {
  ...element_text_1,
  parent: 'root',
};

describe('getRoleEditableStyleKeys', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('restricts nothing on an element without a role', () => {
    expect(getRoleEditableStyleKeys(flatTextElement)).toBeNull();
  });

  it('restricts nothing when the role is not registered', () => {
    const element = { ...flatTextElement, role: 'not-a-registered-role' };

    expect(getRoleEditableStyleKeys(element)).toBeNull();
  });

  it("returns the role's editable style keys", () => {
    const element = { ...flatTextElement, role: 'title' };

    const keys = getRoleEditableStyleKeys(element);

    // The title role offers alignment but reserves the font family
    // for the theme
    expect(keys).toContain('textAlign');
    expect(keys).not.toContain('fontFamily');
  });
});
