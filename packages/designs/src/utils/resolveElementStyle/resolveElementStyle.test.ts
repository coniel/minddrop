import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  PropertyElement,
  RoleDesignElement,
  TextElement,
  TextPropertyElement,
} from '../../design-element-configs';
import { HeadingRole } from '../../roles';
import { DesignFixtures, cleanup, setup } from '../../test-utils';
import { resolveElementStyle } from './resolveElementStyle';

const { element_text_1, element_property_text_1 } = DesignFixtures;

describe('resolveElementStyle', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the element style for elements without a role', () => {
    const element: TextElement = {
      ...element_text_1,
      style: { fontSize: 'sm' },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({ fontSize: 'sm' });
  });

  it('applies the context-resolved role styles over the element style', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: HeadingRole.id,
      // fontSize collides with the size axis default, italic does not
      style: { fontSize: 'sm', italic: true },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({
      color: 'regular',
      fontWeight: 'semibold',
      lineHeight: 'tight',
      // The size axis applies its default option's card font size
      fontSize: 'base',
      italic: true,
    });
  });

  it('resolves against the given layout context', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: HeadingRole.id,
      roleVariants: { size: 'lg' },
      style: {},
    };

    // The same element resolves to a larger font on a page than on
    // a card
    expect(resolveElementStyle(element, 'card')).toMatchObject({
      fontSize: 'md',
    });
    expect(resolveElementStyle(element, 'page')).toMatchObject({
      fontSize: '2xl',
    });
  });

  it('degrades to the element style when the role is not registered', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: 'unknown',
      style: { fontSize: 'sm' },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({ fontSize: 'sm' });
  });

  it('applies the variant theme styles over a property element style', () => {
    const element: TextPropertyElement = {
      ...element_property_text_1,
      variant: 'subtitle',
      // lineHeight collides with the variant's theme styles, italic
      // does not
      style: { lineHeight: 'loose', italic: true },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({
      color: 'subtle',
      lineHeight: 'snug',
      fontSize: 'md',
      italic: true,
    });
  });

  it('lets whitelisted element values override the theme defaults', () => {
    const element: TextPropertyElement = {
      ...element_property_text_1,
      variant: 'subtitle',
      // Colour is whitelisted, so the element's choice wins over
      // the variant's subtle default; line height is not
      style: { color: 'regular', lineHeight: 'loose' },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({
      color: 'regular',
      lineHeight: 'snug',
      fontSize: 'md',
    });
  });

  it('resolves a property element against the given layout context', () => {
    const element: TextPropertyElement = {
      ...element_property_text_1,
      style: {},
    };

    // The same element renders compact on a list row but not on a
    // page
    expect(resolveElementStyle(element, 'list')).toMatchObject({
      fontSize: 'sm',
    });
    expect(resolveElementStyle(element, 'page')).toEqual({
      fontSize: 'base',
      lineHeight: 'none',
      truncate: 1,
    });
  });

  it('degrades to the property element style when its type has no config', () => {
    const element = {
      ...element_property_text_1,
      propertyType: 'toggle',
      style: { fontSize: 'sm' },
    } as unknown as PropertyElement;

    expect(resolveElementStyle(element, 'card')).toEqual({ fontSize: 'sm' });
  });
});
