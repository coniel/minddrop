import { describe, expect, it } from 'vitest';
import { ContainerStyle } from '../styles';
import { createBackdropCss, createContainerCss } from './createContainerCss';

describe('createContainerCss', () => {
  it('emits only the flex base for an empty style', () => {
    expect(createContainerCss({})).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('emits every set value', () => {
    expect(
      createContainerCss({
        direction: 'row',
        align: 'center',
        justify: 'space-between',
        wrap: true,
        gap: '2',
        background: 'raised',
        minHeight: 'md',
        paddingTop: '4',
        paddingLeft: '4',
        marginBottom: '2',
        borderStyle: 'solid',
        borderColor: 'accent',
        borderEmphasis: 'subtle',
        borderTopWidth: 'medium',
        borderRightWidth: 'medium',
        borderBottomWidth: 'medium',
        borderLeftWidth: 'medium',
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      backgroundColor: 'var(--surface-raised)',
      minHeight: 'var(--size-md)',
      paddingTop: 'var(--space-4)',
      paddingLeft: 'var(--space-4)',
      marginBottom: 'var(--space-2)',
      border: 'var(--border-width-medium) solid var(--border-subtle)',
    });
  });

  it('maps start and end alignment onto flex values', () => {
    expect(createContainerCss({ align: 'start', justify: 'end' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    });
  });

  it('scrolls content past a fixed height', () => {
    expect(createContainerCss({ height: 'lg' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--size-lg)',
      overflowX: 'hidden',
      overflowY: 'auto',
    });
  });

  it('grows a filled container into the space left in its parent', () => {
    expect(createContainerCss({ height: 'fill' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      flexBasis: 0,
      minHeight: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
    });
  });

  it('stands a filled container as tall as the row it sits in', () => {
    // Growth in a row would widen the container rather than
    // heighten it, so filling a height there stretches instead
    expect(createContainerCss({ height: 'fill' }, 'row')).toEqual({
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'stretch',
      overflowX: 'hidden',
      overflowY: 'auto',
    });
  });

  it('gives a filled container the share its ratio asks for', () => {
    const css = createContainerCss({ height: 'fill', fillRatio: 3 });

    // Three shares against the single share of a plain fill
    expect(css.flexGrow).toBe(3);
    expect(css.flexBasis).toBe(0);
  });

  it('takes the height of a proportioned container from its width', () => {
    expect(createContainerCss({ aspectRatio: '2/3' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      aspectRatio: '2 / 3',
      overflowX: 'hidden',
      overflowY: 'auto',
    });
  });

  it('keeps the floor of a filled container', () => {
    const css = createContainerCss({ height: 'fill', minHeight: 'sm' });

    // The floor is what stops a zero basis squashing it away
    expect(css.minHeight).toBe('var(--size-sm)');
  });

  it('ignores the floor and cap of a fixed height', () => {
    const css = createContainerCss({
      height: 'lg',
      minHeight: 'sm',
      maxHeight: 'xl',
    });

    // A fixed height leaves nothing for them to bound
    expect(css.minHeight).toBeUndefined();
    expect(css.maxHeight).toBeUndefined();
  });

  it('scrolls content past a capped height', () => {
    expect(createContainerCss({ minHeight: 'sm', maxHeight: 'xl' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'var(--size-sm)',
      maxHeight: 'var(--size-xl)',
      overflowX: 'hidden',
      overflowY: 'auto',
    });
  });

  it('leaves a container with only a floor unscrolled', () => {
    expect(createContainerCss({ minHeight: 'sm' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'var(--size-sm)',
    });
  });

  it('ignores a corner radius lingering from an older vocabulary', () => {
    // Rounding left containers for the rendering context, but
    // persisted styles may still carry the old key
    const style = { borderRadius: 'lg' } as ContainerStyle;

    expect(createContainerCss(style)).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('defaults the border colour to the pinned neutral outline', () => {
    expect(createContainerCss({ borderStyle: 'solid' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      border: 'var(--border-width-thin) solid var(--border-neutral)',
    });
  });

  it('draws only the sides a width is set for', () => {
    expect(
      createContainerCss({
        borderStyle: 'solid',
        borderColor: 'neutral',
        borderEmphasis: 'strong',
        borderLeftWidth: 'thick',
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'column',
      borderLeft:
        'var(--border-width-thick) solid var(--border-neutral-strong)',
    });
  });

  it('draws each side at its own width', () => {
    expect(
      createContainerCss({
        borderStyle: 'solid',
        borderTopWidth: 'thin',
        borderBottomWidth: 'thick',
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'column',
      borderTop: 'var(--border-width-thin) solid var(--border-neutral)',
      borderBottom: 'var(--border-width-thick) solid var(--border-neutral)',
    });
  });

  it('collapses a matching width on every side into the shorthand', () => {
    expect(
      createContainerCss({
        borderStyle: 'solid',
        borderTopWidth: 'medium',
        borderRightWidth: 'medium',
        borderBottomWidth: 'medium',
        borderLeftWidth: 'medium',
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'column',
      border: 'var(--border-width-medium) solid var(--border-neutral)',
    });
  });
});

describe('createBackdropCss', () => {
  it('returns null without backdrop effects', () => {
    expect(createBackdropCss({})).toBeNull();
  });

  it('emits the blur preset', () => {
    expect(createBackdropCss({ backdropBlur: 'regular' })).toEqual({
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    });
  });

  it('scales the blur radius with the preset', () => {
    expect(createBackdropCss({ backdropBlur: 'subtle' })?.backdropFilter).toBe(
      'blur(4px)',
    );
    expect(createBackdropCss({ backdropBlur: 'strong' })?.backdropFilter).toBe(
      'blur(20px)',
    );
  });

  it('emits a changed brightness alongside the blur', () => {
    expect(
      createBackdropCss({ backdropBlur: 'regular', backdropBrightness: 80 })
        ?.backdropFilter,
    ).toBe('blur(12px) brightness(80%)');
  });

  it('emits a brightness without a blur', () => {
    expect(createBackdropCss({ backdropBrightness: 120 })?.backdropFilter).toBe(
      'brightness(120%)',
    );
  });

  it('treats the unchanged brightness as no effect', () => {
    expect(createBackdropCss({ backdropBrightness: 100 })).toBeNull();
  });

  it('washes the blur with the tint at the regular strength', () => {
    const css = createBackdropCss({
      backdropBlur: 'regular',
      backdropTint: 'neutral',
    });

    expect(css?.backgroundColor).toBe(
      'color-mix(in srgb, var(--surface-neutral) 50%, transparent)',
    );
  });

  it('scales the accent tint with the strength', () => {
    const css = createBackdropCss({
      backdropBlur: 'regular',
      backdropTint: 'accent',
      backdropTintStrength: 'strong',
    });

    expect(css?.backgroundColor).toBe(
      'color-mix(in srgb, var(--surface-accent) 75%, transparent)',
    );
  });

  it('leaves the tint off without effects to wash', () => {
    expect(createBackdropCss({ backdropTint: 'accent' })).toBeNull();
  });

  it('masks the effects out with the fade defaults', () => {
    const css = createBackdropCss({
      backdropBlur: 'regular',
      backdropFade: true,
    });

    expect(css?.maskImage).toBe(
      'linear-gradient(to top, black 0%, transparent 50%)',
    );
  });

  it('runs the fade in the given direction and extent', () => {
    const css = createBackdropCss({
      backdropBlur: 'regular',
      backdropFade: true,
      backdropFadeDirection: 'to-right',
      backdropFadeExtent: 80,
    });

    expect(css?.maskImage).toBe(
      'linear-gradient(to right, black 0%, transparent 80%)',
    );
  });

  it('holds the effects solid up to the fade start', () => {
    const css = createBackdropCss({
      backdropBlur: 'regular',
      backdropFade: true,
      backdropFadeStart: 25,
      backdropFadeExtent: 40,
    });

    expect(css?.maskImage).toBe(
      'linear-gradient(to top, black 25%, transparent 40%)',
    );
  });

  it('leaves the fade off without effects to mask', () => {
    expect(createBackdropCss({ backdropFade: true })).toBeNull();
  });
});
