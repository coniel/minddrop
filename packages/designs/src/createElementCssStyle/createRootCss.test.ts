import { describe, expect, it } from 'vitest';
import { createRootCss } from './createRootCss';

describe('createRootCss', () => {
  it('defaults an empty style to the subtle coloured treatment', () => {
    expect(createRootCss({})).toEqual({
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface-subtle)',
    });
  });

  it('defaults full-screen roots to the transparent treatment', () => {
    // Page and space roots blend into the surface they fill
    expect(createRootCss({}, undefined, 'page')).toMatchObject({
      backgroundColor: 'var(--surface-app)',
    });
    expect(createRootCss({}, undefined, 'space')).toMatchObject({
      backgroundColor: 'var(--surface-app)',
    });
  });

  it('defaults floating roots to the subtle coloured treatment', () => {
    expect(createRootCss({}, undefined, 'card')).toMatchObject({
      backgroundColor: 'var(--surface-subtle)',
    });
  });

  it('paints a list root through the row surface variable', () => {
    // The rendering context swaps the variable per row state
    expect(createRootCss({}, undefined, 'list')).toMatchObject({
      backgroundColor: 'var(--design-list-row-surface, var(--surface-subtle))',
    });
  });

  it('paints a transparent root in the surface views render on', () => {
    expect(createRootCss({ background: 'transparent' })).toMatchObject({
      backgroundColor: 'var(--surface-app)',
    });
  });

  it('paints a regular accent root on the scheme accent surface', () => {
    expect(
      createRootCss({ background: 'accent', emphasis: 'regular' }),
    ).toMatchObject({
      backgroundColor: 'var(--surface-accent)',
    });
  });

  it('paints a subtle emphasis as a quiet wash', () => {
    expect(
      createRootCss({ background: 'accent', emphasis: 'subtle' }),
    ).toMatchObject({
      backgroundColor: 'var(--surface-subtle)',
    });
  });

  it('pairs a solid emphasis with the contrasting text colour', () => {
    expect(
      createRootCss({ background: 'accent', emphasis: 'solid' }),
    ).toMatchObject({
      backgroundColor: 'var(--surface-solid-accent)',
      color: 'var(--text-on-solid)',
    });
  });

  it('ignores the emphasis on a transparent root', () => {
    const css = createRootCss({ background: 'transparent', emphasis: 'solid' });

    expect(css.backgroundColor).toBe('var(--surface-app)');
    expect(css.color).toBeUndefined();
  });

  it('emits the shared container blocks', () => {
    expect(
      createRootCss({
        direction: 'row',
        gap: '2',
        paddingTop: '3',
      }),
    ).toMatchObject({
      flexDirection: 'row',
      gap: 'var(--space-2)',
      paddingTop: 'var(--space-3)',
    });
  });

  it('centres a capped content column', () => {
    expect(createRootCss({ maxWidth: 'content' })).toMatchObject({
      maxWidth: 'var(--measure-content)',
      marginLeft: 'auto',
      marginRight: 'auto',
    });
  });

  it("leaves a panelled root's row uncapped", () => {
    // The cap belongs to the content region rather than the row
    const css = createRootCss({ direction: 'row', maxWidth: 'content' });

    expect(css.maxWidth).toBeUndefined();
  });

  it('pads the content column outside its cap', () => {
    expect(
      createRootCss({ maxWidth: 'content', contentPadding: '4' }),
    ).toMatchObject({
      paddingLeft: 'var(--space-4)',
      paddingRight: 'var(--space-4)',
      // The cap widens by the padding, so the content keeps its
      // full measure while the page has the room for it
      maxWidth: 'calc(var(--measure-content) + 2 * var(--space-4))',
    });
  });

  it('pads an uncapped content column plainly', () => {
    expect(createRootCss({ contentPadding: '4' })).toMatchObject({
      paddingLeft: 'var(--space-4)',
      paddingRight: 'var(--space-4)',
    });
  });

  it("keeps the content padding off a panelled root's row", () => {
    const css = createRootCss({ direction: 'row', contentPadding: '4' });

    expect(css.paddingLeft).toBeUndefined();
  });
});
