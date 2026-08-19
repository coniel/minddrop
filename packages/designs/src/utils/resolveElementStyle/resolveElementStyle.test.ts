import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RoleDesignElement, TextElement } from '../../design-element-configs';
import { TitleRole } from '../../roles';
import { DesignFixtures, cleanup, setup } from '../../test-utils';
import { resolveElementStyle } from './resolveElementStyle';

const { element_text_1 } = DesignFixtures;

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
      role: TitleRole.id,
      // fontSize collides with the size axis default, italic does not
      style: { fontSize: 'sm', italic: true },
    };

    expect(resolveElementStyle(element, 'card')).toEqual({
      color: 'regular',
      fontWeight: 'semibold',
      lineHeight: 'tight',
      // The size axis applies its default option's card font size
      fontSize: 'md',
      italic: true,
    });
  });

  it('resolves against the given layout context', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: TitleRole.id,
      roleVariants: { size: 'lg' },
      style: {},
    };

    // The same element resolves to a larger font on a page than on
    // a card
    expect(resolveElementStyle(element, 'card')).toMatchObject({
      fontSize: 'xl',
    });
    expect(resolveElementStyle(element, 'page')).toMatchObject({
      fontSize: '5xl',
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
});
