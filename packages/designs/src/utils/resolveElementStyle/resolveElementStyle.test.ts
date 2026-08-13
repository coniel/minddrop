import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RoleDesignElement, TextElement } from '../../design-element-configs';
import { CardTitleRole } from '../../roles';
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

    expect(resolveElementStyle(element)).toEqual({ fontSize: 'sm' });
  });

  it('applies the locked styles and axis defaults over the element style', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: CardTitleRole.id,
      // fontSize collides with the size axis default, italic does not
      style: { fontSize: 'sm', italic: true },
    };

    expect(resolveElementStyle(element)).toEqual({
      ...CardTitleRole.lockedStyle,
      // The size axis applies its default option
      fontSize: 'md',
      italic: true,
    });
  });

  it('applies the selected option of each variant axis', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: CardTitleRole.id,
      roleVariants: { size: 'lg' },
      style: {},
    };

    expect(resolveElementStyle(element)).toEqual({
      ...CardTitleRole.lockedStyle,
      fontSize: 'xl',
    });
  });

  it('falls back to the axis default for unknown option IDs', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: CardTitleRole.id,
      roleVariants: { size: 'unknown' },
      style: {},
    };

    expect(resolveElementStyle(element)).toEqual({
      ...CardTitleRole.lockedStyle,
      fontSize: 'md',
    });
  });

  it('degrades to the element style when the role is not registered', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: 'unknown',
      style: { fontSize: 'sm' },
    };

    expect(resolveElementStyle(element)).toEqual({ fontSize: 'sm' });
  });
});
