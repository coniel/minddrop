import { describe, expect, it } from 'vitest';
import { iconDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveElementIcon } from './resolveElementIcon';

// An icon element with an icon picked on it
const element = { ...iconDesignElement, content: 'lucide:star:yellow' };

// The icon on a property's schema
const schemaIcon = 'lucide:calendar:default';

describe('resolveElementIcon', () => {
  it("resolves an icon property's value", () => {
    expect(
      resolveElementIcon(element, {
        schema: { type: 'icon', name: 'Icon', icon: schemaIcon },
        value: 'lucide:cat:cyan',
      }),
    ).toBe('lucide:cat:cyan');
  });

  it("resolves another property's schema icon", () => {
    expect(
      resolveElementIcon(element, {
        schema: { type: 'date', name: 'Due', icon: schemaIcon },
        value: new Date(),
      }),
    ).toBe(schemaIcon);
  });

  it('falls back to the picked icon for an unmapped element', () => {
    expect(resolveElementIcon(element, undefined)).toBe(element.content);
  });

  it('falls back to the picked icon when an icon property has no value', () => {
    expect(
      resolveElementIcon(element, {
        schema: { type: 'icon', name: 'Icon', icon: schemaIcon },
        value: null,
      }),
    ).toBe(element.content);
  });

  it('falls back to the picked icon when the schema has none', () => {
    expect(
      resolveElementIcon(element, {
        schema: { type: 'date', name: 'Due' },
        value: new Date(),
      }),
    ).toBe(element.content);
  });

  it('resolves nothing when neither the property nor the element has one', () => {
    expect(
      resolveElementIcon({ ...iconDesignElement }, undefined),
    ).toBeUndefined();
  });
});
