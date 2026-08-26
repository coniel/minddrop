import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RoleDesignElement, TextElement } from '../design-element-configs';
import { HeadingRole } from '../roles';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { createElementCssStyle } from './createElementCssStyle';

const { element_text_1, element_container_1 } = DesignFixtures;

describe('createElementCssStyle', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('dispatches to the type category generator', () => {
    const element: TextElement = {
      ...element_text_1,
      style: { fontSize: 'sm' },
    };

    expect(createElementCssStyle(element)).toEqual({
      fontSize: 'var(--font-size-sm)',
    });
  });

  it('renders containers through the container generator', () => {
    expect(createElementCssStyle(element_container_1)).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('applies role variant styles over the element style', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: HeadingRole.id,
      style: { fontSize: 'sm', italic: true },
    };

    expect(createElementCssStyle(element, undefined, 'card')).toEqual({
      // Locked card heading typography wins over the element's own size
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-tight)',
      color: 'var(--text-regular)',
      // Unlocked keys stay editable
      fontStyle: 'italic',
    });
  });

  it('renders the selected role variant options', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: HeadingRole.id,
      roleVariants: { size: 'lg' },
      style: {},
    };

    expect(createElementCssStyle(element, undefined, 'card').fontSize).toBe(
      'var(--font-size-md)',
    );
  });

  it('degrades to the element style when the role is not registered', () => {
    const element: RoleDesignElement<TextElement> = {
      ...element_text_1,
      role: 'unknown',
      style: { fontSize: 'sm' },
    };

    expect(createElementCssStyle(element)).toEqual({
      fontSize: 'var(--font-size-sm)',
    });
  });
});
